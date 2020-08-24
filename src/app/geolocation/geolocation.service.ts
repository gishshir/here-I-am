import { Injectable, OnDestroy, OnInit, Inject, HostListener } from '@angular/core';
import { NotificationService } from '../common/notification/notification.service';
import { Message } from '../common/message.type';
import { Trajet, TrajetState } from '../trajets/trajet.type';
import { PHP_API_SERVER, CommonService, MessageHandler, HTTP_HEADER_URL, Handler, StringResponseHandler } from '../common/common.service';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppPosition } from '../trajets/position.type';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import * as fileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService implements OnInit, OnDestroy {

  // determine si la geolocation est possible ou non sur le navigateur/systeme
  private geolocation: boolean;
  private pid: number = -1;
  private trajetid: number = -1;

  // token sur le timer
  private timerid: number = -1;


  private currentPosition: AppPosition;
  // stockage en mémoire de la  liste des positions
  private listPositions: Array<AppPosition>;

  private geo_options = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 10000
  };

  constructor(private notificationService: NotificationService, private http: HttpClient,
    private commonService: CommonService, @Inject(LOCAL_STORAGE) private storage: StorageService) {
    if ("geolocation" in navigator) {

      console.log("geolocation existe");
      this.geolocation = true;

      // abonnement à une modification de mon trajet
      //nouveau | changement etat | changement moyen transport
      this.notificationService.monTrajet$.subscribe(
        (t: Trajet) => this.onChangeMonTrajet(t)
      )

      // abonnement a un logout
      this.notificationService.closedSession$.subscribe(
        (v: boolean) => this.clearWatchAndSave()
      )

    } else {
      console.log("fonction geolocation n'existe pas sur ce navigateur!");
      this.geolocation = false;
    }
  }

  ngOnInit(): void {

  }
  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    this.clearWatchAndSave();
  }

  private clearWatchAndSave(): void {
    this.clearWatch();
    this.saveListPositionsToLocalStorage();
  }

  getCurrentPosition(): AppPosition {
    return this.currentPosition;
  }


  private onChangeMonTrajet(trajet: Trajet) {
    console.log("GeolocationService#onChangeTrajet");

    let newtrajet = trajet && this.trajetid != trajet.id;
    this.trajetid = trajet ? trajet.id : -1;

    if (trajet && trajet.etat != TrajetState.ended) {
      if (newtrajet) {
        this.restoreListePositionsFromLocalStorage();
      }
      this.startWatch();
    } else {

      // trajet ended
      this.clearWatchAndSave();

      // sauvegarde sur le serveur de la liste complète
      if (this.listPositions) {
        this.insererListePositions(this.listPositions, {
          onError: (e: Message) => console.log(e.msg),
          onMessage: (m: Message) => {
            console.log(m.msg);
            this.storage.remove(this.buildLocalStorageKey());
          }
        });
      }
    }
  }


  // utilisation d'un timer à la place de l'API de geolocation
  // qui n'est pas fiable
  private startWatch() {

    if (this.geolocation && this.timerid < 0) {
      console.log("startWatch()");

      this.notificationService.activateGeolocation(true);
      this.findCurrentPosition();

      //rafraichir position toutes les 30s 
      this.timerid = window.setInterval(() => {

        this.findCurrentPosition();

      }, 30000);
      console.log("geolocation timerid: " + this.timerid);
    }

  }

  private findCurrentPosition(): void {

    navigator.geolocation.getCurrentPosition(
      (position: Position) => this.geo_success(position),
      () => this.geo_error(),
      this.geo_options);
  }

  private clearWatch() {

    if (this.timerid >= 0) {

      this.notificationService.activateGeolocation(false);
      this.notificationService.useNetwork(false);
      console.log("clearWatch()");
      clearInterval(this.timerid);
      this.timerid = -1;
    }

  }

  private geo_success(position: Position): void {

    // ne pas soliciter trop le reseau
    let timestampSec = Math.floor(position.timestamp / 1000);
    console.log("geo_success - TS (sec): " + timestampSec);


    if (this.currentPosition &&
      (timestampSec - this.currentPosition.timestamp < 30)) {
      return;
    }

    this.currentPosition = {

      trajetid: this.trajetid,
      latitude: position.coords.latitude + "",
      longitude: position.coords.longitude + "",
      timestamp: timestampSec
    }

    this.storePosition(this.currentPosition);
    this.notificationService.changeMaPosition(this.currentPosition);

    if (this.trajetid > 0) {
      console.log("appel du service insererNouvellePosition()...");
      this.insererNouvellePosition(this.currentPosition, {
        onMessage: (m: Message) => {
          console.log(m.msg);
          this.notificationService.useNetwork(true);
        },
        onError: (e: Message) => {
          console.log(e.msg);
          this.notificationService.useNetwork(false);
        }
      });
    }


  }
  private geo_error() {
    console.log("Position inconnue!");
    //this.clearWatch();
  }

  // stockage en mémoire et dans le LocalStorage
  private storePosition(appPosition: AppPosition): void {

    if (appPosition && appPosition.trajetid > 0) {

      this.listPositions.push(appPosition);
      this.saveListPositionsToLocalStorage();
    }

  }

  private buildLocalStorageKey(): string {
    return "TRAJET#" + this.trajetid;
  }
  private restoreListePositionsFromLocalStorage(): void {

    console.log("restoreListePositionsFromLocalStorage...")
    if (this.trajetid > 0) {
      let key: string = this.buildLocalStorageKey();
      if (this.storage.has(key)) {
        // on récupère les valeurs stockées sur ce même trajet
        this.listPositions = JSON.parse(this.storage.get(key));

        this.listPositions.forEach(p => console.log("position: [trajetid:" + p.timestamp + " - tmst: " + p.timestamp));
      } else {
        console.log(".. pas de positions stockées!")
        this.listPositions = new Array<AppPosition>();
      }
    }
  }
  private saveListPositionsToLocalStorage(): void {

    if (this.trajetid > 0 && this.listPositions) {
      let key: string = this.buildLocalStorageKey();
      let values = JSON.stringify(this.listPositions);
      console.log("saveListPositionsToLocalStorage(): " + values);
      this.storage.set(key, values);
    }
  }

  // ===========================================================
  private _callDownloadGpxfile(gpxfile: string): Observable<string> {

    let url = PHP_API_SERVER + "/geolocation/gpx/read.php";
    let options = {
      headers: HTTP_HEADER_URL,
      reportProgress: true,
      params: new HttpParams().set("gpx", gpxfile),
      responseType: 'text' as const
    };
    return this.http.get(url, options)
      .pipe(catchError(this.commonService.handleError));

  }
  downloadGpxfile(gpxfile: string, handler: MessageHandler): void {

    this._callDownloadGpxfile(gpxfile).subscribe({
      next: (data: string) => {
        handler.onMessage({ msg: "téléchargement en cours...", error: false })
        var file = new File([data], gpxfile, { type: "text/plain;charset=utf-8" });
        fileSaver.saveAs(file);
      },
      error: (error: string) => {
        this.commonService._propageErrorToHandler(error, handler);
      }
    }
    )
  }
  // ===========================================================
  private _callCreateGpxfile(trajetid: number): Observable<any> {

    let url = PHP_API_SERVER + "/geolocation/gpx/create.php";

    return this.http.post<Message>(url, { "trajetid": trajetid }, this.commonService.httpOptionsHeaderJson)
      .pipe(catchError(this.commonService.handleError));

  }
  createGpxfile(trajetid: number, handler: StringResponseHandler): void {

    this._callCreateGpxfile(trajetid).subscribe({
      next: (resp: Message) => {
        // le nom du fichier est dans le msg
        handler.onResponse(resp.msg);
      },
      error: (error: string) => {
        this.commonService._propageErrorToHandler(error, handler);
      }
    }
    )
  }
  // ===========================================================
  private _callInsertTrajetPosition(newPosition: AppPosition): Observable<any> {

    let url = PHP_API_SERVER + "/geolocation/create.php";

    return this.http.post<Message>(url, newPosition, this.commonService.httpOptionsHeaderJson)
      .pipe(catchError(this.commonService.handleError));

  }
  private insererNouvellePosition(currentPosition: AppPosition, handler: MessageHandler): void {

    this._callInsertTrajetPosition(currentPosition).subscribe(
      this.commonService._createMessageObserver(handler));
  }
  // ===========================================================

  // ===========================================================
  private _callInsertTrajetListePositions(listPositions: Array<AppPosition>): Observable<any> {

    let url = PHP_API_SERVER + "/geolocation/create.php";

    return this.http.post<Message>(url, listPositions, this.commonService.httpOptionsHeaderJson)
      .pipe(catchError(this.commonService.handleError));

  }
  private insererListePositions(listPositions: Array<AppPosition>, handler: MessageHandler): void {

    this._callInsertTrajetListePositions(listPositions).subscribe(
      this.commonService._createMessageObserver(handler));
  }
  // ===========================================================

  // ===========================================================
  private _callFindTrajetPosition(trajetid: number): Observable<any> {

    let url = PHP_API_SERVER + "/geolocation/read_one.php";

    let options = {
      headers: HTTP_HEADER_URL,
      params: new HttpParams().set("trajetid", trajetid + "")

    };
    // attention si pas de Position alors {"retour": false}
    return this.http.get<AppPosition>(url, options)
      .pipe(catchError(this.commonService.handleError));

  }
  findTrajetPosition(trajetid: number, handler: AppPositionHandler): void {

    this._callFindTrajetPosition(trajetid).subscribe(

      (p: any) => {
        p = (p && p.retour == false) ? null : p;
        handler.onGetPosition(p);
      },
      (error: string) => this.commonService._propageErrorToHandler(error, handler)
    );
  }


  //=============================================
  buildUrlToMaps(position: AppPosition): string {

    if (position) {
      let latitude = Number(position.latitude);
      let longitude = Number(position.longitude);

      let sexaLat = this.convertToSexagesimal(latitude);
      //console.log("latitude: " + sexaLat);
      let sexaLong = this.convertToSexagesimal(longitude);
      //console.log("longitude: " + sexaLong);

      return "https://www.google.fr/maps/place/" + sexaLat + "N+" + sexaLong + "E/@" + latitude + "," + longitude;
    }
    else {
      return null;
    }
  }

  private convertToSexagesimal(value: number): string {

    let test: number = value;
    let degres = Math.trunc(test);

    test = test - degres;
    test = test * 60;

    let minutes = Math.trunc(test);

    test = test - minutes;
    test = test * 60 * 10;
    test = Math.trunc(test);

    let secondes = test / 10;

    let result = degres + "%C2%B0" + minutes + "'" + secondes + "%22";
    //degres + "%C2%B" + minutes + "'" + secondes + "%22";
    return result;
  }

}

export interface AppPositionHandler extends Handler {

  onGetPosition(position?: AppPosition): void;
}

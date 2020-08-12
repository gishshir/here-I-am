import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../common/notification/notification.service';
import { Message } from '../common/message.type';
import { Trajet, TrajetState } from '../trajets/trajet.type';
import { PHP_API_SERVER, CommonService, MessageHandler, HTTP_HEADER_URL, Handler } from '../common/common.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppPosition } from '../trajets/position.type';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService implements OnInit, OnDestroy {

  // determine si la geolocation est possible ou non sur le navigateur/systeme
  private geolocation: boolean;
  private pid: number = -1;
  private trajetid: number = -1;


  private currentPosition: AppPosition;

  private geo_options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 30000
  };

  constructor(private notificationService: NotificationService, private http: HttpClient,
    private commonService: CommonService) {
    if ("geolocation" in navigator) {

      console.log("geolocation existe");
      this.geolocation = true;

      // abonnement à une modification de mon trajet
      //nouveau | changement etat | changement moyen transport
      this.notificationService.monTrajet$.subscribe(
        (t: Trajet) => this.onChangeMonTrajet(t)
      )

    } else {
      console.log("fonction geolocation n'existe pas sur ce navigateur!");
      this.geolocation = false;
    }
  }

  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.clearWatch();
  }

  getCurrentPosition(): AppPosition {
    return this.currentPosition;
  }

  private initCurrentLocation() {

    if (this.geolocation && this.currentPosition === undefined) {

      navigator.geolocation.getCurrentPosition(
        (position: Position) => this.geo_success(position),
        () => this.geo_error(),
        this.geo_options);
    }

  }


  private onChangeMonTrajet(trajet: Trajet) {
    console.log("GeolocationService#onChangeTrajet");

    this.trajetid = trajet ? trajet.id : -1;

    if (trajet && trajet.etat != TrajetState.ended) {
      this.startWatch();
    } else {
      this.clearWatch();
    }
  }


  private startWatch() {

    if (this.geolocation && this.pid < 0) {
      console.log("startWatch()");

      this.notificationService.activateGeolocation(true);

      this.pid = navigator.geolocation.watchPosition(
        (position: Position) => this.geo_success(position),
        () => this.geo_error(),
        this.geo_options);
      console.log("geolocation pid: " + this.pid);
    }

  }

  private clearWatch() {

    if (this.pid >= 0) {

      this.notificationService.activateGeolocation(false);
      this.notificationService.useNetwork(false);
      console.log("clearWatch(): " + this.pid);
      navigator.geolocation.clearWatch(this.pid);
      this.pid = -1;
    }

  }

  private geo_success(position: Position) {

    console.log("geo_success: " + position.timestamp);

    this.currentPosition = {

      trajetid: this.trajetid,
      latitude: position.coords.latitude + "",
      longitude: position.coords.longitude + "",
      timestamp: Math.floor(position.timestamp / 1000)
    }

    this.notificationService.changeMaPosition(this.currentPosition);

    if (this.trajetid > 0) {
      console.log("appel du service insererNouvellePosition()...");
      this.insererNouvellePosition(this.trajetid, this.currentPosition, {
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


  // ===========================================================
  private _callInsertTrajetPosition(newPosition: AppPosition): Observable<any> {

    let url = PHP_API_SERVER + "/geolocation/create.php";

    return this.http.post<Message>(url, newPosition, this.commonService.httpOptionsHeaderJson)
      .pipe(catchError(this.commonService.handleError));

  }
  private insererNouvellePosition(trajetid: number, currentPosition: AppPosition, handler: MessageHandler): void {

    this._callInsertTrajetPosition(currentPosition).subscribe(
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

      (p: AppPosition) => handler.onGetPosition(p),
      (error: string) => this.commonService._propageErrorToHandler(error, handler)
    );
  }


  //=============================================
  buildUrlToMaps(position: AppPosition): string {

    let latitude = Number(position.latitude);
    let longitude = Number(position.longitude);

    let sexaLat = this.convertToSexagesimal(latitude);
    //console.log("latitude: " + sexaLat);
    let sexaLong = this.convertToSexagesimal(longitude);
    //console.log("longitude: " + sexaLong);

    return "https://www.google.fr/maps/place/" + sexaLat + "N+" + sexaLong + "E/@" + latitude + "," + longitude;
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

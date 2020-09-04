import { Injectable, Inject } from '@angular/core';
import { AppPosition } from '../trajets/position.type';
import { Observable } from 'rxjs';
import { PHP_API_SERVER, MessageHandler, CommonService, Handler, HTTP_HEADER_URL, StringResponseHandler } from '../common/common.service';
import { Message } from '../common/message.type';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../common/notification/notification.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Geoportail } from '../geoportail/geoportail.type';


import * as fileSaver from 'file-saver';

/**
 * Gestion des positions d'un trajet quelconque
 */
@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor(private notificationService: NotificationService, private http: HttpClient,
    private commonService: CommonService, @Inject(LOCAL_STORAGE) private storage: StorageService) { }


  restoreListePositionsFromLocalStorage(trajetid: number): Array<AppPosition> {

    console.log("restoreListePositionsFromLocalStorage...");

    let listPositions = new Array<AppPosition>();
    if (trajetid > 0) {
      let key: string = this.buildLocalStorageKey(trajetid);
      if (this.storage.has(key)) {
        // on récupère les valeurs stockées sur ce même trajet
        listPositions = JSON.parse(this.storage.get(key));

        listPositions.forEach(p => console.log("position: [trajetid:" + p.timestamp + " - tmst: " + p.timestamp));
      } else {
        console.log(".. pas de positions stockées!")

      }
    }
    return listPositions;
  }
  saveListPositionsToLocalStorage(trajetid: number, listPositions: Array<AppPosition>): void {

    if (trajetid > 0 && listPositions && listPositions.length > 0) {
      let key: string = this.buildLocalStorageKey(trajetid);
      let values = JSON.stringify(listPositions);
      console.log("saveListPositionsToLocalStorage(): " + values);
      this.storage.set(key, values);
    }
  }

  insererListePositionAndClearLocalStorage(trajetid: number, listPositions: Array<AppPosition>): void {

    if (listPositions && listPositions.length > 0) {
      this.insererListePositions(listPositions, {
        onError: (e: Message) => console.log(e.msg),
        onMessage: (m: Message) => {
          console.log(m.msg);
          this.storage.remove(this.buildLocalStorageKey(trajetid));
        }
      });
    }
  }

  private buildLocalStorageKey(trajetid: number): string {
    return "TRAJET#" + trajetid;
  }

  // ===========================================================
  private _callInsertTrajetPosition(newPosition: AppPosition): Observable<any> {

    let url = PHP_API_SERVER + "/geolocation/create.php";

    return this.http.post<Message>(url, newPosition, this.commonService.httpOptionsHeaderJson)
      .pipe(catchError(this.commonService.handleError));

  }
  insererNouvellePosition(currentPosition: AppPosition, handler: MessageHandler): void {

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
  insererListePositions(listPositions: Array<AppPosition>, handler: MessageHandler): void {

    this._callInsertTrajetListePositions(listPositions).subscribe(
      this.commonService._createMessageObserver(handler));
  }
  // ===========================================================

  // ===========================================================
  private _callFindTrajetLastPosition(trajetid: number): Observable<any> {

    let url = PHP_API_SERVER + "/geolocation/read_one.php";

    let options = {
      headers: HTTP_HEADER_URL,
      params: new HttpParams().set("trajetid", trajetid + "")

    };
    // attention si pas de Position alors {"retour": false}
    return this.http.get<AppPosition>(url, options)
      .pipe(catchError(this.commonService.handleError));

  }
  findTrajetLastPosition(trajetid: number, handler: AppPositionHandler): void {

    this._callFindTrajetLastPosition(trajetid).subscribe(

      (p: any) => {
        p = (p && p.retour == false) ? null : p;
        handler.onGetPosition(p);
      },
      (error: string) => this.commonService._propageErrorToHandler(error, handler)
    );
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

    return this.http.post<Geoportail>(url, { "trajetid": trajetid }, this.commonService.httpOptionsHeaderJson)
      .pipe(catchError(this.commonService.handleError));

  }
  createGpxfile(trajetid: number, handler: GeoportailHandler): void {

    this._callCreateGpxfile(trajetid).subscribe({
      next: (geoportail: Geoportail) => {
        // le nom du fichier est dans le msg
        handler.onGetGeoportailInfo(geoportail);
      },
      error: (error: string) => {
        this.commonService._propageErrorToHandler(error, handler);
      }
    }
    )
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

export interface GeoportailHandler extends Handler {
  onGetGeoportailInfo(geoportail: Geoportail): void;
}

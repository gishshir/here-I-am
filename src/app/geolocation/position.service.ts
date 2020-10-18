import { Injectable, Inject } from '@angular/core';
import { AppPosition } from '../trajets/position.type';
import { AppStorageService } from '../trajets/storage.service';
import { Observable } from 'rxjs';
import { MessageHandler, CommonService, Handler, HTTP_HEADER_URL, TOMCAT_API_SERVER } from '../common/common.service';
import { Message } from '../common/message.type';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Geoportail } from '../geoportail/geoportail.type';


import * as fileSaver from 'file-saver';

/**
 * Gestion des positions d'un trajet quelconque
 */
@Injectable({
  providedIn: 'root'
})
export class PositionService {


  constructor(private http: HttpClient,
    private commonService: CommonService, private localStorage: AppStorageService) {
  }


  insererListePositionAndClearLocalStorage(): void {

    let listPositions: Array<AppPosition> = this.localStorage.restoreCurrentPositions();
    if (listPositions && listPositions.length > 0) {
      this.insererListePositions(listPositions, {
        onError: (e: Message) => console.log(e.msg),
        onMessage: (m: Message) => {
          console.log(m.msg);
          this.localStorage.clearLocalStorageListPositions();
        }
      });
    }
  }

  // ===========================================================
  private _callInsertTrajetPosition(newPosition: AppPosition): Observable<any> {

    let url = TOMCAT_API_SERVER + "/geolocation";

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

    let url = TOMCAT_API_SERVER + "/geolocations";

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

    let url = TOMCAT_API_SERVER + "/geolocation/" + trajetid;

    // attention si pas de Position alors {"retour": false}
    return this.http.get<AppPosition>(url)
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

    let url = TOMCAT_API_SERVER + "/gpx/" + gpxfile;

    let options = {
      headers: HTTP_HEADER_URL,
      reportProgress: true,
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
  private _callCreateGpxfile(trajetid: number, ami: boolean,): Observable<any> {

    let uri = ami ? "/ami/gpx/" : "/gpx/";
    let url = TOMCAT_API_SERVER + uri + trajetid;

    return this.http.post<Geoportail>(url, this.commonService.httpOptionsHeaderJson)
      .pipe(catchError(this.commonService.handleError));

  }

  createGpxfile(trajetid: number, ami: boolean, handler: GeoportailHandler): void {

    this._callCreateGpxfile(trajetid, ami).subscribe({
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

  /*
 * aucune position n'est enregistrée.
 * Verifier le local storage contient ces informations
 * Si c'est le cas elles sont envoyées au serveur et le local storage est nettoyé.
 * C'est une fonction de récupération dans le cas où l'envoi normal a échoué pour
 * un problème réseau.
 */
  verifierSiListPositionExisteInLocalStorage() {

    let listPositions = this.localStorage.restoreCurrentPositions();
    if (listPositions && listPositions.length > 0) {

      // on les envoie sur le serveur distant
      this.insererListePositionAndClearLocalStorage();
    }
  }

  // mets à jour le trajet id dans la liste des positions
  // après sauvegarde réussie d'un trajet
  updateListPositionsInLocalStorage(trajetidOld: number, trajetidBdd: number) {

    console.log("changer le trajetid des positions sauvegardées de " + trajetidOld + " vers " + trajetidBdd);
    let listPositions: Array<AppPosition> = this.localStorage.restoreCurrentPositions();
    if (listPositions && listPositions.length > 0) {

      listPositions.filter(p => p.trajetid == trajetidOld).forEach(

        (p: AppPosition) => {
          console.log("correctif " + p.timestamp);
          p.trajetid = trajetidBdd;
        }
      );

      this.localStorage.storeCurrentPositions(listPositions);

    }
  }

  // construit la liste des positions en fonction de l'id du trajet
  buildListPositionsInLocalStorageForTrajet(trajetid: number): Array<AppPosition> {

    console.log("buildListPositionsInLocalStorageForTrajet()");
    let listPositions: Array<AppPosition> = this.localStorage.restoreCurrentPositions();

    let listPositionsForTrajet = new Array<AppPosition>();

    if (listPositions && listPositions.length > 0) {
      listPositionsForTrajet = listPositions.filter(p => p.trajetid == trajetid);
    }

    return listPositionsForTrajet;
  }

  clearListPositionsInLocalStorageForTrajet(trajetid: number): void {

    console.log("clearListPositionsInLocalStorageForTrajet()");
    let listPositions: Array<AppPosition> = this.localStorage.restoreCurrentPositions();

    let listPositionsHorsTrajet = new Array<AppPosition>();

    if (listPositions && listPositions.length > 0) {
      listPositionsHorsTrajet = listPositions.filter(p => p.trajetid != trajetid);
    }

    this.localStorage.storeCurrentPositions(listPositionsHorsTrajet);
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

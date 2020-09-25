import { Injectable, OnInit } from '@angular/core';
import { LoggerService } from '../common/logger.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Trajet, TrajetState, TrajetMeans } from './trajet.type';
import { CommonService, PHP_API_SERVER, Handler, MessageHandler, HTTP_HEADER_URL, TOMCAT_API_SERVER } from '../common/common.service';
import { Message } from '../common/message.type';
import { NotificationService } from '../common/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class TrajetService {

  constructor(private logger: LoggerService, private http: HttpClient, private commonService: CommonService,
    private notificationService: NotificationService) { }


  //=============================================
  private _callFindTrajetById(trajetid: number): Observable<any> {

    let url = PHP_API_SERVER + "/trajet/read_one.php";

    let options = {
      headers: HTTP_HEADER_URL,
      params: new HttpParams().set("id", trajetid + "")

    };
    // attention si pas de trajet alors {"retour": false}
    return this.http.get<Trajet>(url, options)
      .pipe(catchError(this.commonService.handleError));
  }
  findTrajetById(trajetid: number, handler: TrajetHandler): void {

    /*this._callFindTrajetById(trajetid).subscribe(

      (t: Trajet) => handler.onGetTrajet(t),
      (error: string) => this.commonService._propageErrorToHandler(error, handler)
    );*/
  }

  // ============================================
  private _callListeTrajets(): Observable<any> {

    let url = PHP_API_SERVER + "/trajet/read.php";

    return this.http.get<Trajet[]>(url)
      .pipe(catchError(this.commonService.handleError));
  }

  getListeTrajets(handler?: TrajetsHandler): void {
    this.logger.log("construire la liste des trajets");

    this._callListeTrajets().subscribe(
      // next
      (datas: Trajet[]) => {
        if (handler) { handler.onGetList(datas); }
      },
      // error
      (error: string) => this.commonService._propageErrorToHandler(error, handler)


    )
  }
  // ============================================

  // ============================================
  private _callAmiDernierTrajet(idrelation: number): Observable<any> {

    let url = TOMCAT_API_SERVER + "/trajet/ami/" + idrelation;
    //PHP_API_SERVER + "/trajet/read_one.php";

    let options = {
      headers: HTTP_HEADER_URL
    };
    // attention si pas de trajet alors {"retour": false}
    return this.http.get<Trajet>(url, options)
      .pipe(catchError(this.commonService.handleError));
  }
  chercherAmiDernierTrajet(idrelation: number, handler: TrajetHandler): void {

    this._callAmiDernierTrajet(idrelation).subscribe(
      // next (boolean ou trajet)
      (data: Trajet) => {
        handler.onGetTrajet(data);
      },
      // error
      (error: string) => this.commonService._propageErrorToHandler(error, handler)

    );
  }
  // ============================================
  private _callDernierTrajet(): Observable<any> {

    let url = TOMCAT_API_SERVER + "/trajet";
    //PHP_API_SERVER + "/trajet/read_one.php";

    // attention si pas de trajet alors {"retour": false}
    return this.http.get<Trajet>(url)
      .pipe(catchError(this.commonService.handleError));
  }
  chercherDernierTrajet(handler: TrajetHandler): void {

    this._callDernierTrajet().subscribe(
      // next (boolean ou trajet)
      (data: Trajet) => {
        handler.onGetTrajet(data);
      },
      // error
      (error: string) => this.commonService._propageErrorToHandler(error, handler)

    );
  }
  // determine si le dernier trajet est dans un etat particulier
  compareEtatDernierTrajet(etat: TrajetState): Observable<boolean> {

    return this._callDernierTrajet().pipe(
      map((t?: any) => ((t && t.retour == false) || (t && t.id && t.etat == etat))));
  }

  // ===========================================================



  // ===========================================================
  private _callCreateTrajet(newTrajet: Trajet): Observable<any> {

    let url = PHP_API_SERVER + "/trajet/create.php";

    return this.http.post<Trajet>(url, newTrajet, this.commonService.httpOptionsHeaderJson)
      .pipe(catchError(this.commonService.handleError));

  }
  demarrerNouveauTrajet(mean: TrajetMeans, handler: TrajetHandler): void {

    let trajet: Trajet = {

      id: -1,
      starttime: new Date().getTime(),
      endtime: null,
      etat: TrajetState.started,
      mean: mean
    };

    this._callCreateTrajet(trajet).subscribe(
      // next
      (data: Trajet) => handler.onGetTrajet(data)
      ,
      // error
      (error: string) => this.commonService._propageErrorToHandler(error, handler)

    );

  }
  // ===========================================================

  // ===========================================================
  private _callDeleteTrajet(id: number): Observable<any> {

    let url = PHP_API_SERVER + "/trajet/delete.php";

    let options = {
      body: { "id": "" + id }
    };

    return this.http.request<Message>('delete', url, options)
      .pipe(
        catchError(this.commonService.handleError)
      );
  }

  deleteTrajet(trajetToDelete: Trajet, handler: MessageHandler): void {

    this._callDeleteTrajet(trajetToDelete.id).subscribe(
      this.commonService._createMessageObserver(handler)
    );
  }
  // ===========================================================


  // ===========================================================
  private _callUpdateTrajet(trajetToUpdate: Trajet): Observable<any> {

    let url = PHP_API_SERVER + "/trajet/update.php";

    return this.http.put<Message>(url, trajetToUpdate, this.commonService.httpOptionsHeaderJson)
      .pipe(
        catchError(this.commonService.handleError)
      );
  }

  updateTrajet(trajetToUpdate: Trajet, handler: TrajetHandler): void {

    this._callUpdateTrajet(trajetToUpdate).subscribe(
      // next
      (data: Trajet) => handler.onGetTrajet(data)
      ,
      // error
      (error: string) => this.commonService._propageErrorToHandler(error, handler)

    );

  }
  changerStatusTrajet(trajetId: number, newState: TrajetState, handler: TrajetHandler): void {


    let trajetToUpdate: Trajet = {

      id: trajetId,
      etat: newState,
      starttime: -1,
      endtime: -1,
      mean: null
    }

    this.updateTrajet(trajetToUpdate, handler);
  }
  changerMeanTrajet(trajetId: number, newMean: TrajetMeans, handler: TrajetHandler): void {

    let trajetToUpdate: Trajet = {

      id: trajetId,
      etat: null,
      starttime: -1,
      endtime: -1,
      mean: newMean
    }

    this.updateTrajet(trajetToUpdate, handler);
  }
  // ===========================================================

}


export interface TrajetsHandler extends Handler {

  onGetList(liste: Trajet[]): void;

}

export interface TrajetHandler extends Handler {

  onGetTrajet(trajet?: Trajet): void;
}


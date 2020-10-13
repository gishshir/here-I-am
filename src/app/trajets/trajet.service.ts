import { Injectable } from '@angular/core';
import { LoggerService } from '../common/logger.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Trajet, TrajetState, TrajetMeans } from './trajet.type';
import { CommonService, Handler, MessageHandler, HTTP_HEADER_URL, TOMCAT_API_SERVER } from '../common/common.service';
import { Message } from '../common/message.type';
import { ToolsService } from '../common/tools.service';
import { AppStorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TrajetService {

  constructor(private logger: LoggerService, private http: HttpClient, private commonService: CommonService,
    private toolsService: ToolsService, private localStorage: AppStorageService) { }

  // chercher un trajet par son id, soit pour l'utilisateur courant soit pour un ami.
  private _callFindTrajetById(trajetid: number, ami: boolean): Observable<any> {

    let uri = ami ? "ami/" : "";
    let url = TOMCAT_API_SERVER + "/trajet/" + uri + trajetid;

    // attention si pas de trajet alors {"retour": false}
    return this.http.get<Trajet>(url)
      .pipe(catchError(this.commonService.handleError));
  }
  findTrajetById(trajetid: number, ami: boolean, handler: TrajetHandler): void {

    this._callFindTrajetById(trajetid, ami).subscribe(

      (t: Trajet) => handler.onGetTrajet(t),
      (error: string) => this.commonService._propageErrorToHandler(error, handler)
    );
  }


  // ============================================
  private _callListeTrajets(): Observable<any> {

    let url = TOMCAT_API_SERVER + "/trajets"

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

    let url = TOMCAT_API_SERVER + "/last/trajet/relation/" + idrelation;

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

    let url = TOMCAT_API_SERVER + "/trajet";

    return this.http.post<Trajet>(url, newTrajet, this.commonService.httpOptionsHeaderJson)
      .pipe(catchError(this.commonService.handleError));

  }
  demarrerNouveauTrajet(mean: TrajetMeans, handler: TrajetHandler): void {

    let newTrajet: Trajet = {
      id: -999,
      starttime: this.toolsService.getNowTimestampEnSec(),
      endtime: -1,
      mean: mean,
      etat: TrajetState.started
    };

    this._callCreateTrajet(newTrajet).subscribe(
      // next
      (trajet: Trajet) => {
        this.localStorage.saveTrajet(trajet);
        handler.onGetTrajet(trajet);
      }
      ,
      // error
      (error: string) => {
        this.localStorage.saveTrajet(newTrajet);
        this.commonService._propageErrorToHandler(error, handler);
      }

    );

  }
  // ===========================================================

  // ===========================================================
  private _callDeleteTrajet(id: number): Observable<any> {

    let url = TOMCAT_API_SERVER + "/trajet/" + id;

    return this.http.request<Message>('delete', url)
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
  private _callUpdateTrajetStatus(trajetToUpdate: any): Observable<any> {

    let url = TOMCAT_API_SERVER + "/trajet/etat"

    return this.http.put<Message>(url, trajetToUpdate, this.commonService.httpOptionsHeaderJson)
      .pipe(
        catchError(this.commonService.handleError)
      );
  }
  private _callUpdateTrajetMean(trajetToUpdate: any): Observable<any> {

    let url = TOMCAT_API_SERVER + "/trajet/mean"

    return this.http.put<Message>(url, trajetToUpdate, this.commonService.httpOptionsHeaderJson)
      .pipe(
        catchError(this.commonService.handleError)
      );
  }

  changerStatusTrajet(trajetId: number, newState: TrajetState, handler: TrajetHandler): void {


    let trajetToUpdate: any = {

      trajetid: trajetId,
      etat: newState,
      timestamp: this.toolsService.getNowTimestampEnSec()
    }

    this._callUpdateTrajetStatus(trajetToUpdate).subscribe(
      // next
      (trajet: Trajet) => {
        this.localStorage.saveTrajet(trajet);
        if (newState == TrajetState.ended) {
          this.localStorage.clearLocalStorageTrajet(trajetId);
        }
        handler.onGetTrajet(trajet);
      }
      ,
      // error
      (error: string) => {
        let trajetLocal: Trajet = this.localStorage.restoreTrajet(trajetId);
        if (trajetLocal) {
          trajetLocal.etat = newState;
          this.localStorage.saveTrajet(trajetLocal);
        }
        this.commonService._propageErrorToHandler(error, handler);
      }

    );
  }
  changerMeanTrajet(trajetId: number, newMean: TrajetMeans, handler: TrajetHandler): void {

    let trajetToUpdate: any = {

      trajetid: trajetId,
      mean: newMean
    }

    this._callUpdateTrajetMean(trajetToUpdate).subscribe(
      // next
      (data: Trajet) => handler.onGetTrajet(data)
      ,
      // error
      (error: string) => this.commonService._propageErrorToHandler(error, handler)

    );
  }
  // ===========================================================

}


export interface TrajetsHandler extends Handler {

  onGetList(liste: Trajet[]): void;

}

export interface TrajetHandler extends Handler {

  onGetTrajet(trajet?: Trajet): void;
}


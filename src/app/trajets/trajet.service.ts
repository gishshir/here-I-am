import { Injectable } from '@angular/core';
import { LoggerService } from '../common/logger.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, Observer } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TrajetState } from './trajet-etat.enum';
import { Trajet } from './trajet.type';
import { TrajetMeans } from './trajet-means.enum';
import { CommonService, PHP_API_SERVER, Handler, MessageHandler } from '../common/common.service';
import { Message } from '../common/message.type';

@Injectable({
  providedIn: 'root'
})
export class TrajetService extends CommonService {

  constructor(private logger: LoggerService, private http: HttpClient) {
    super();
  }


  // ============================================
  private _callListeTrajets(): Observable<any> {

    let url = PHP_API_SERVER + "/trajet/read.php";

    return this.http.get<Trajet[]>(url)
      .pipe(catchError(super.handleError));
  }

  getListeTrajets(handler?: TrajetsHandler): void {
    this.logger.log("construire la liste des trajets");

    this._callListeTrajets().subscribe(
      // next
      (datas: Trajet[]) => {
        if (handler) { handler.onGetList(datas); }
      },
      // error
      (error: string) => {
        this._propageErrorToHandler(error, handler);
      }

    )
  }
  // ============================================


  private _callDernierTrajet(): Observable<any> {

    let url = PHP_API_SERVER + "/trajet/read_one.php";

    return this.http.get<Trajet[]>(url)
      .pipe(catchError(super.handleError));
  }
  chercherDernierTrajet(handler: TrajetHandler): void {

    this._callDernierTrajet().subscribe(
      // next
      (data: Trajet) => handler.onGetTrajet(data)
      ,
      // error
      (error: string) => this._propageErrorToHandler(error, handler)

    );
  }

  // ===========================================================
  private _callCreateTrajet(newTrajet: Trajet): Observable<any> {

    let url = PHP_API_SERVER + "/trajet/create.php";

    return this.http.post<Trajet>(url, newTrajet, this.httpOptions)
      .pipe(catchError(super.handleError));

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
      (error: string) => this._propageErrorToHandler(error, handler)

    );

  }
  // ===========================================================


  // ===========================================================
  private _callUpdateTrajet(trajetToUpdate: Trajet): Observable<any> {

    let url = PHP_API_SERVER + "/trajet/update.php";

    return this.http.put<Message>(url, trajetToUpdate, this.httpOptions)
      .pipe(
        catchError(super.handleError)
      );
  }

  updateTrajet(trajetToUpdate: Trajet, handler: MessageHandler): void {

    this._callUpdateTrajet(trajetToUpdate).subscribe(
      this._createMessageObserver(handler)
    );

  }
  changerStatusTrajet(trajetId: number, newState: TrajetState, handler: MessageHandler): void {


    let trajetToUpdate: Trajet = {

      id: trajetId,
      etat: newState,
      starttime: -1,
      endtime: -1,
      mean: null
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

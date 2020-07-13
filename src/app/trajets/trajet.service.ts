import { Injectable } from '@angular/core';
import { LoggerService } from '../common/logger.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TrajetState } from './trajet-etat.enum';
import { Trajet } from './trajet.type';
import { TrajetMeans } from './trajet-means.enum';
import { CommonService, PHP_API_SERVER, Handler } from '../common/common.service';
import { Message } from '../common/message.type';

@Injectable({
  providedIn: 'root'
})
export class TrajetService extends CommonService {

  constructor(private logger: LoggerService, private http: HttpClient) {
    super();
  }

  cachedtrajets: Trajet[];


  // ============================================
  private _callListeTrajets(): Observable<any> {

    let url = PHP_API_SERVER + "/trajet/read.php";

    return this.http.get<Trajet[]>(url)
      .pipe(catchError(super.handleError));
  }

  getListeTrajets(handler?: TrajetsHandler): void {
    this.logger.log("construire la liste des trajets");

    this.cachedtrajets = [];
    this._callListeTrajets().subscribe(
      // next
      (datas: Trajet[]) => {
        this.cachedtrajets = datas;
        if (handler) { handler.onGetList(datas); }
      },
      // error
      (error: string) => {
        this._propageErrorToHandler(error, handler);
      }

    )
  }
  // ============================================


  chercherTrajetEnCours(handler: TrajetHandler): void {

    let trajet: Trajet = this.cachedtrajets.find(t =>

      t.etat !== TrajetState.ended
    );
    handler.onGetTrajet(trajet);

  }

  chercherDernierTrajet(handler: TrajetHandler, refresh: boolean): void {

    if (this.cachedtrajets && this.cachedtrajets.length > 0) {

      handler.onGetTrajet(this.cachedtrajets[this.cachedtrajets.length - 1]);

    } else {

      if (refresh) {
        this.getListeTrajets({
          onGetList: l => this.chercherDernierTrajet(handler, false),
          onError: e => handler.onError(e)
        });
      } else {
        handler.onGetTrajet(null);
      }

    }
  }

  // ===========================================================
  private _callCreateTrajet(newTrajet: Trajet): Observable<any> {

    let url = PHP_API_SERVER + "/trajet/create.php";

    return this.http.post<Trajet>(url, newTrajet, this.httpOptions)
      .pipe(catchError(super.handleError));

  }
  demarrerNouveauTrajet(userId: number, mean: TrajetMeans): Trajet {

    let trajet: Trajet = {

      id: -1,
      starttime: new Date().getTime(),
      endtime: null,
      etat: TrajetState.started,
      mean: mean
    };


    this.cachedtrajets.push(trajet);

    return trajet;
  }
  // ===========================================================

  changerStatus(trajetId: number, newState: TrajetState): Trajet {

    let trajet: Trajet = this.getTrajetById(trajetId);
    if (trajet != null) {
      trajet.etat = newState;

      if (trajet.etat === TrajetState.ended) {
        trajet.endtime = new Date().getTime();
      }
      return trajet;
    }

    return trajet;

  }

  getTrajetById(trajetid: number): Trajet {

    let trajet = null;

    return this.cachedtrajets.find(t => t.id == trajetid);

  }
}

export interface TrajetsHandler extends Handler {

  onGetList(liste: Trajet[]): void;

}

export interface TrajetHandler extends Handler {

  onGetTrajet(trajet?: Trajet): void;
}

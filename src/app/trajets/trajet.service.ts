import { Injectable } from '@angular/core';
import { LoggerService } from '../common/logger.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Trajet, TrajetState, TrajetMeans } from './trajet.type';
import { CommonService, Handler, MessageHandler, HTTP_HEADER_URL, TOMCAT_API_SERVER, BoolResponseHandler } from '../common/common.service';
import { Message } from '../common/message.type';
import { ToolsService } from '../common/tools.service';
import { AppStorageService } from './storage.service';
import { NotificationService } from '../common/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class TrajetService {

  constructor(private logger: LoggerService, private http: HttpClient, private commonService: CommonService,
    private toolsService: ToolsService, private localStorage: AppStorageService,
    private notificationService: NotificationService) {

    // abonnement au changement d'utilisateur
    this.notificationService.changeUser$.subscribe(
      (pseudo?: string) => {
        if (pseudo) {
          console.log("pseudo: " + pseudo);
          this.sauvegarderTrajetsArchives();
        }
      }
    );


  }

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

    // Dans tous les cas, on regarde si on n'a pas un trajet dans le local storage
    let trajetLocal = this.localStorage.restoreCurrentTrajet();

    this._callDernierTrajet().subscribe(
      // next (boolean ou trajet)
      (trajet: Trajet) => {
        this._analyseDifferenceTrajetLocalRemote(trajetLocal, trajet, handler);
      },
      // error
      (error: string) => {
        if (trajetLocal) {
          console.log("onGetTrajet LOCAL !!");
          handler.onGetTrajet(trajetLocal);
        } else {
          this.commonService._propageErrorToHandler(error, handler);
        }
      }
    );
  }
  // si on constate des différences entre le trajet stocké en local et celui de la bdd,
  // il faut déterminer lequel est le plus fiable 
  //et mettre à jour le local storage ou la bdd si nécessaire
  private _analyseDifferenceTrajetLocalRemote(trajetLocal: Trajet, trajetRemote: Trajet, handler: TrajetHandler): void {

    let trajet = null;

    // pas de trajet local
    if (trajetLocal == null) {
      //this.localStorage.saveCurrentTrajet(trajetRemote);
      trajet = trajetRemote;
      //handler.onGetTrajet(trajetRemote);
    }
    // ===============================
    // trajet différents
    // ===============================
    // on garde celui qui a le starttime le plus récent
    else if (trajetLocal.id != trajetRemote.id) {

      trajet = (trajetLocal.starttime > trajetRemote.starttime) ? trajetLocal : trajetRemote;
    }

    // ===============================
    // trajet identiques
    // ===============================

    // trajet remote terminé
    else if (trajetRemote.etat == TrajetState.ended) {
      trajet = trajetRemote;
    }

    //  status différent: c'est le trajet local qui va etre privilégié
    else if (trajetLocal.etat != trajetRemote.etat) {
      // on enregistre le dernier etat en BDD 
      this.changerStatusTrajet(trajetLocal, trajetLocal.etat, handler);
      trajet = null; // pas de propagation
    }
    //  moyen de transport différent: c'est le trajet local qui va etre privilégié
    else if (trajetLocal.mean != trajetRemote.mean) {
      // on enregistre le dernier mean en BDD 
      this.changerMeanTrajet(trajetLocal.id, trajetLocal.mean, handler);
      trajet = null; // pas de propagation
    }
    // pas de différence
    else {
      trajet = trajetRemote;
    }

    if (trajet == trajetRemote) {
      console.log("Trajet REMOTE ecrase trajet LOCAL !!");
      this.localStorage.saveCurrentTrajet(trajetRemote);
    } else {
      console.log("Trajet LOCAL ecrase trajet REMOTE !!");
    }
    if (trajet != null) {
      // propagation vers le handler
      handler.onGetTrajet(trajet);
    }

  }
  // determine si le dernier trajet est dans un etat particulier
  compareEtatDernierTrajet(etat: TrajetState): Observable<boolean> {

    // fonction de transformation des values du stream 
    let responsMap = map((t?: any) => ((t && t.retour == false) || (t && t.id && t.etat == etat)));

    // Dans tous les cas, on regarde si on n'a pas un trajet dans le local storage
    let trajetLocal = this.localStorage.restoreCurrentTrajet();

    let errorFunction = (e: any) => {
      let localResp: boolean = trajetLocal == null || trajetLocal.etat == TrajetState.ended;
      return of(localResp)
    };

    return this._callDernierTrajet().pipe(responsMap,
      catchError(errorFunction));
  }

  // ===========================================================



  // ===========================================================
  private _callCreateTrajet(newTrajet: Trajet): Observable<any> {

    let url = TOMCAT_API_SERVER + "/trajet";

    return this.http.post<Trajet>(url, newTrajet, this.commonService.httpOptionsHeaderJson)
      .pipe(catchError(this.commonService.handleError));

  }
  demarrerNouveauTrajet(mean: TrajetMeans, handler: TrajetHandler): void {

    // Dans tous les cas, on regarde si on n'a pas un trajet dans le local storage
    let trajetLocal = this.localStorage.restoreCurrentTrajet();
    // si existe on l'archive pour ne pas l'écraser
    if (trajetLocal) {
      this.localStorage.archiveTrajet(trajetLocal);
    }

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
        this.localStorage.saveCurrentTrajet(trajet);
        handler.onGetTrajet(trajet);
      }
      ,
      // error
      (error: string) => {
        this.localStorage.saveCurrentTrajet(newTrajet);
        handler.onGetTrajet(newTrajet);
      }

    );
  }


  saveTrajet(trajetToSave: Trajet, handler: TrajetHandler): void {

    this._callCreateTrajet(trajetToSave).subscribe(
      // next
      (trajet: Trajet) => {
        this.localStorage.saveCurrentTrajet(trajet);
        handler.onGetTrajet(trajet);
      }
      ,
      // error
      (error: string) => {
        this.localStorage.saveCurrentTrajet(trajetToSave);
        handler.onGetTrajet(trajetToSave);
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

  changerStatusTrajet(trajet: Trajet, newState: TrajetState, handler: TrajetHandler): void {

    let timestamp = this.toolsService.getNowTimestampEnSec();

    // creation d'un trajet uniquement local
    if (trajet.id < 0) {

      trajet.etat = newState;
      if (newState == TrajetState.ended) {
        trajet.endtime = timestamp;
      }
      this.saveTrajet(trajet, handler);
    }
    // update status (cas nominal)
    else {

      let trajetToUpdate: any = {

        trajetid: trajet.id,
        etat: newState,
        timestamp: timestamp
      }
      this._callUpdateTrajetStatus(trajetToUpdate).subscribe(
        // next
        (trajet: Trajet) => {
          this.localStorage.saveCurrentTrajet(trajet);
          if (newState == TrajetState.ended) {
            this.localStorage.clearLocalStorageTrajet();
          }
          handler.onGetTrajet(trajet);
        }
        ,
        // error
        (error: string) => {
          let trajetLocal: Trajet = this.localStorage.restoreCurrentTrajet();
          if (trajetLocal) {
            trajetLocal.etat = newState;
            if (newState == TrajetState.ended) {
              trajetLocal.endtime = timestamp;
            }
            this.localStorage.saveCurrentTrajet(trajetLocal);
            handler.onGetTrajet(trajetLocal);
          } else {
            this.commonService._propageErrorToHandler(error, handler);
          }
        }

      );
    }
  }
  changerMeanTrajet(trajetId: number, newMean: TrajetMeans, handler: TrajetHandler): void {

    let trajetToUpdate: any = {

      trajetid: trajetId,
      mean: newMean
    }

    this._callUpdateTrajetMean(trajetToUpdate).subscribe(
      // next
      (trajet: Trajet) => {
        this.localStorage.saveCurrentTrajet(trajet);
        handler.onGetTrajet(trajet);
      }
      ,
      // error
      (error: string) => {
        let trajetLocal: Trajet = this.localStorage.restoreCurrentTrajet();
        if (trajetLocal) {
          trajetLocal.mean = newMean;
          this.localStorage.saveCurrentTrajet(trajetLocal);
          handler.onGetTrajet(trajetLocal);
        } else {
          this.commonService._propageErrorToHandler(error, handler);
        }
      }

    );
  }
  // ===========================================================
  private _callSaveTrajetArchives(listTrajets: Array<Trajet>): Observable<boolean> {

    let url = TOMCAT_API_SERVER + "/trajets";

    return this.http.post<boolean>(url, listTrajets, this.commonService.httpOptionsHeaderJson)
      .pipe(catchError(this.commonService.handleError));

  }

  sauvegarderTrajetsArchives(): void {

    console.log("sauvergarderTrajetsArchives()....");
    let trajetArchives: Array<Trajet> = this.localStorage.restoreListTrajetArchives();
    if (trajetArchives.length == 0) {
      return;
    }

    this._callSaveTrajetArchives(trajetArchives).subscribe(

      (result: boolean) => {
        console.log("Les trajets archivés ont été sauvegardés en BDD!");
        this.localStorage.clearLocalStorageTrajetsArchives();
      },

      (e: Message) => console.log("Echec de la sauvegarde des trajets archivés.")

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


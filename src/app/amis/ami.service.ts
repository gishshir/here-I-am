import { Injectable } from '@angular/core';
import { LoggerService } from '../common/logger.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AmiInfo, AmiPersonne, AmiRelation } from './amiinfo.type';
import { Ami, AmiState } from './ami.type';
import { CommonService, PHP_API_SERVER, Handler, MessageHandler, HTTP_HEADER_URL } from '../common/common.service';
import { Message, BoolResponse } from '../common/message.type';
import { AmisFilter } from './amis.pipe';
import { RelationState } from './relation/relationinfo.type';



@Injectable({
  providedIn: 'root'
})
export class AmiService {

  constructor(private logger: LoggerService, private http: HttpClient, private commonService: CommonService) {
    console.log("amiService constructor");
  }

  createPseudoFilter(etatRelation: RelationState) {


    let filterFunction = function (ami: Ami, filter: string): boolean {

      if (ami.etatrelation != etatRelation) {
        return false;
      }
      if (!filter || filter == "*") {
        return true;
      }

      let result: boolean = ami.pseudo.toLowerCase().search(filter) > -1
      return result;
    }

    return filterFunction;

  }
  createEtaRelationFilter() {

    let filterFunction = function (ami: Ami, filter: string): boolean {

      if (!filter || filter == AmisFilter.tous) {
        return true;
      }

      switch (filter) {

        case AmisFilter.valide: return ami.etatrelation == RelationState.open;
        case AmisFilter.aValider: return ami.etatrelation == RelationState.pending;
        case AmisFilter.refuse: return ami.etatrelation == RelationState.closed;
      }
      return false;
    }

    return filterFunction;

  }

  // =============================================
  private _callListePersonneNonAmis(): Observable<any> {

    this.logger.log("callListePersonneNonAmis()");

    let url = PHP_API_SERVER + "/personne/read.php";

    return this.http.get<AmiPersonne[]>(url)
      .pipe(catchError(this.commonService.handleError));

  }


  getListePersonneNonAmis(handler: AmiPersonnesHandler): void {

    this._callListePersonneNonAmis().subscribe(

      // next
      (datas: AmiPersonne[]) => {
        handler.onGetList(datas);
      },
      // error
      (error: string) => {
        this.commonService._propageErrorToHandler(error, handler);
      }

    );

  }
  // =============================================

  // =============================================
  private _callGetRelationPointVueAmi(idrelation: number): Observable<any> {

    let url = PHP_API_SERVER + "/relation/notification_par_ami//read.php";

    let options = {
      headers: HTTP_HEADER_URL,
      params: new HttpParams().set("idrelation", idrelation + "")

    };
    return this.http.get<AmiRelation>(url, options)
      .pipe(catchError(this.commonService.handleError));
  }

  // =============================================
  getRelationPointVueAmi(idrelation: number, handler: AmiRelationHandler): void {

    this._callGetRelationPointVueAmi(idrelation).subscribe({

      next: (amiRelation: AmiRelation) => handler.onGetAmiRelation(amiRelation),
      error: (error: string) => this.commonService._propageErrorToHandler(error, handler)
    }
    );
  }


  // =============================================
  private _callAmiByIdPerson(idperson: number): Observable<any> {

    this.logger.log("getAmiInfo()");
    let url = PHP_API_SERVER + "/ami/read_one.php";

    let options = {
      headers: HTTP_HEADER_URL,
      params: new HttpParams().set("idperson", idperson + "")

    };
    return this.http.get<AmiInfo>(url, options);

  }

  getAmiByIdPerson(idperson: number, handler: AmiHandler): void {

    this._callAmiByIdPerson(idperson).subscribe({

      next: (data: AmiInfo) => handler.onGetAmi(this.buildAmiFromJs(data)),
      error: (error: string) => this.commonService._propageErrorToHandler(error, handler)
    });
  }
  // =============================================

  // =============================================
  private _callListeAmis(): Observable<any> {

    this.logger.log("getListeAmis()");

    let url = PHP_API_SERVER + "/ami/read.php";

    return this.http.get<AmiInfo[]>(url)
      .pipe(catchError(this.commonService.handleError));

  }


  getListeAmis(handler: AmisHandler): void {

    this._callListeAmis().subscribe(

      // next
      (datas: AmiInfo[]) => {
        let amis: Ami[] = [];
        datas.forEach(a => {
          amis.push(this.buildAmiFromJs(a));
        });
        handler.onGetList(amis);
      },
      // error
      (error: string) => {
        this.commonService._propageErrorToHandler(error, handler);
      }

    );

  }
  // =============================================

  // =====================================================
  private _callUpdate(amiToUpdate: object): Observable<any> {

    let url = PHP_API_SERVER + "/ami/update.php";

    return this.http.put<Message>(url, amiToUpdate, this.commonService.httpOptionsHeaderJson)
      .pipe(
        // call observer.error(...) si http code != 200
        catchError(this.commonService.handleError)
        // sinon call observer.next(body), puis observer.complete()
      );
  }
  updateSuivreAmi(amiToUpdate: Ami, handler: MessageHandler): any {
    this.logger.log("updateAmi() " + amiToUpdate.pseudo + " suivre: " + amiToUpdate.suivre);
    this._callUpdate({ idrelation: amiToUpdate.idrelation, suivre: amiToUpdate.suivre }).subscribe(
      this.commonService._createMessageObserver(handler)
    );
  }
  updateNotifierAmi(amiToUpdate: Ami, handler: MessageHandler): any {
    this.logger.log("updateAmi() " + amiToUpdate.pseudo + " notifier: " + amiToUpdate.notifier);
    this._callUpdate({ idrelation: amiToUpdate.idrelation, notifier: amiToUpdate.notifier }).subscribe(
      this.commonService._createMessageObserver(handler)
    );
  }
  // =====================================================



  getAmiState(etat: string): AmiState {

    switch (etat) {

      case "Arret": return AmiState.Arret;
      case "EnChemin": return AmiState.EnChemin;
      case "Pause": return AmiState.Pause;

      default: return AmiState.NonConnu;
    }

  }

  buildAmiFromJs(amijs: AmiInfo): Ami {

    let ami: Ami = {

      idrelation: amijs.relation.id,
      pseudo: amijs.personne.pseudo,
      etat: this.getAmiState(amijs.personne.etat),
      suivre: amijs.relation.suivre,
      notifier: amijs.relation.notifier,
      etatrelation: amijs.relation.etat

    };
    return ami;
  }
}

export interface AmisHandler extends Handler {

  onGetList(liste: Ami[]): void;

}
export interface AmiPersonnesHandler extends Handler {

  onGetList(liste: AmiPersonne[]): void;

}
export interface AmiHandler extends Handler {

  onGetAmi(ami: Ami): void;
}

export interface AmiRelationHandler extends Handler {

  onGetAmiRelation(amiRelation: AmiRelation): void;
}
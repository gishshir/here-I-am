import { Injectable } from '@angular/core';
import { LoggerService } from '../common/logger.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AmiInfo } from './amiinfo.type';
import { Ami } from './ami.type';
import { AmiState } from './ami.etat.enum';
import { CommonService, PHP_API_SERVER, Handler } from '../common/common.service';
import { Message } from '../common/message.type';



@Injectable({
  providedIn: 'root'
})
export class AmiService extends CommonService {

  constructor(private logger: LoggerService, private http: HttpClient) {
    super();
  }

  // =============================================
  private _callListeAmis(): Observable<any> {

    this.logger.log("getListeAmis()");

    let url = PHP_API_SERVER + "/ami/read.php";

    return this.http.get<AmiInfo[]>(url)
      .pipe(catchError(super.handleError));

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
        this._propageErrorToHandler(error, handler);
      }

    );

  }
  // =============================================

  // =====================================================
  private _callUpdate(amiToUpdate: Ami): Observable<any> {

    this.logger.log("updateEtatAmi()");

    let url = PHP_API_SERVER + "/ami/update.php";

    return this.http.put<Message>(url, amiToUpdate, this.httpOptions)
      .pipe(
        // call observer.error(...) si http code != 200
        catchError(super.handleError)
        // sinon call observer.next(body), puis observer.complete()
      );
  }
  updateAmi(amiToUpdate: Ami, handler: AmiHandler): any {

    this._callUpdate(amiToUpdate).subscribe(
      (resp: Message) => {
        handler.onMessage(resp);
      },
      (error: string) => {
        this._propageErrorToHandler(error, handler);
      }

    );
  }
  // =====================================================



  getAmiState(etat: string): AmiState {

    switch (etat) {

      case "Arret": return AmiState.Arret;
      case "EnChemin": return AmiState.EnChemin;
      case "Pause": return AmiState.Pause;
      default: return AmiState.Arret;
    }

  }

  buildAmiFromJs(amijs: AmiInfo): Ami {

    let ami: Ami = {

      "idrelation": amijs.relation.id,
      "pseudo": amijs.personne.pseudo,
      "etat": this.getAmiState(amijs.personne.etat),
      "suivre": amijs.relation.suivre

    };
    return ami;
  }
}

export interface AmisHandler extends Handler {

  onGetList(liste: Ami[]): void;

}

export interface AmiHandler extends Handler {

  onMessage(message: Message): void;
}



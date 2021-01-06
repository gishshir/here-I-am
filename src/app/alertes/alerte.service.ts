import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonService, Handler, HTTP_HEADER_URL, MessageHandler, TOMCAT_API_SERVER } from '../common/common.service';
import { Message } from '../common/message.type';
import { Alerte, CountAlerteInfo } from './alerte.type';

@Injectable({
  providedIn: 'root'
})
export class AlerteService {

  constructor(private http: HttpClient, private commonService: CommonService) { }


  // ============================================
  // liste des alertes en cours
  // ============================================

  private _callCountCurrentAlertes(): Observable<CountAlerteInfo> {

    let url = TOMCAT_API_SERVER + "/alertes/count";

    return this.http.get<CountAlerteInfo>(url)
      .pipe(catchError(this.commonService.handleError));
  }
  countCurrentAlertes(handler: CountCurrentAlerteHandler): void {

    this._callCountCurrentAlertes().subscribe(

      (info: CountAlerteInfo) => handler.onGetInfo(info),
      (e: Message) => handler.onError(e)
    );
  }

  // ============================================

  private _callListCurrentAlertes(): Observable<Alerte[]> {

    let url = TOMCAT_API_SERVER + "/alertes";

    return this.http.get<Alerte[]>(url)
      .pipe(catchError(this.commonService.handleError));
  }
  listCurrentAlertes(handler: AlertesHandler): void {

    this._callListCurrentAlertes().subscribe(

      (list: Alerte[]) => handler.onGetList(list),
      (e: Message) => handler.onError(e)
    );
  }

  // ============================================
  private _callValideAlerte(alerteid: number): Observable<Message> {

    let options = {
      headers: HTTP_HEADER_URL
    };
    let url = TOMCAT_API_SERVER + "/alerte/" + alerteid;
    return this.http.put<Message>(url, options)
      .pipe(catchError(this.commonService.handleError));
  }
  valideAlerte(alerteid: number, handler: MessageHandler): void {

    this._callValideAlerte(alerteid).subscribe(

      (m: Message) => handler.onMessage(m),
      (e: Message) => handler.onError(e)
    );
  }


}

export interface CountCurrentAlerteHandler extends Handler {

  onGetInfo(info: CountAlerteInfo): void;
}

export interface AlertesHandler extends Handler {
  onGetList(list: Alerte[]): void;
}
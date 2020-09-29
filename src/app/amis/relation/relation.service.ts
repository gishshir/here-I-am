import { Injectable } from '@angular/core';
import { LoggerService } from '../../common/logger.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonService, PHP_API_SERVER, Handler, HTTP_HEADER_URL, MessageHandler, TOMCAT_API_SERVER } from 'src/app/common/common.service';
import { RelationInfo, RelationAction } from './relationinfo.type';
import { Message } from 'src/app/common/message.type';
import { NotificationService } from 'src/app/common/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class RelationService {

  constructor(private logger: LoggerService, private http: HttpClient,
    protected commonService: CommonService) { }


  // ===========================================================
  private _callDeleteRelation(id: number): Observable<any> {

    let url = TOMCAT_API_SERVER + "/relation/" + id;
    //PHP_API_SERVER + "/relation/delete.php";

    /*let options = {
      // params: new HttpParams().set("id", "" + id)
      body: { "id": "" + id }
    };*/

    return this.http.request<Message>('delete', url)
      .pipe(
        catchError(this.commonService.handleError)
      );
  }

  deleteRelation(relationIdToDelete: number, handler: MessageHandler): void {

    this._callDeleteRelation(relationIdToDelete).subscribe(
      this.commonService._createMessageObserver(handler)
    );
  }
  // ===========================================================

  //==============================================================
  private _callCreateInvitation(idperson: number): Observable<any> {

    let url = TOMCAT_API_SERVER + "/relation/invitation/" + idperson;
    //PHP_API_SERVER + "/relation/create.php";
    return this.http.post<Message>(url, this.commonService.httpOptionsHeaderJson)
      .pipe(catchError(this.commonService.handleError));
  }
  createInvitation(idperson: number, handler: MessageHandler): void {

    this._callCreateInvitation(idperson)
      .subscribe(this.commonService._createMessageObserver(handler));
  }
  //==============================================================


  //==============================================================
  private _callActionUpdate(relationToUpdate: object): Observable<any> {

    let url = TOMCAT_API_SERVER + "/relation/action";
    //PHP_API_SERVER + "/relation/update.php";

    return this.http.put<Message>(url, relationToUpdate, this.commonService.httpOptionsHeaderJson)
      .pipe(catchError(this.commonService.handleError));
  }
  updateActionRelation(relationid: number, action: string, handler: MessageHandler): any {
    this.logger.log("updateRelation() : " + action);
    this._callActionUpdate({ relationid: relationid, action: action }).subscribe(
      this.commonService._createMessageObserver(handler)
    );
  }
  //==============================================================

  //==============================================================
  private _callRelationInfo(idrelation: number): Observable<any> {

    let url = TOMCAT_API_SERVER + "/relation/" + idrelation;
    //PHP_API_SERVER + "/relation/read.php";
    /*let options = {
      headers: HTTP_HEADER_URL,
      params: new HttpParams().set("id", idrelation + "")

    };*/
    return this.http.get<RelationInfo>(url, this.commonService.httpOptionsHeaderJson)
      .pipe(catchError(this.commonService.handleError));

  }
  getRelationInfoById(idrelation: number, handler: RelationInfoHandler): void {

    this._callRelationInfo(idrelation).subscribe({

      next: (relationinfo: RelationInfo) => handler.onGetRelationInfo(relationinfo),
      error: (error: Message) => handler.onError(error)
    });
  }
  //==============================================================
}

export interface RelationInfoHandler extends Handler {

  onGetRelationInfo(relationinfo: RelationInfo): void;
}

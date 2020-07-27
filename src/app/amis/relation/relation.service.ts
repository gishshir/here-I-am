import { Injectable } from '@angular/core';
import { LoggerService } from '../../common/logger.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonService, PHP_API_SERVER, Handler, HTTP_HEADER_URL, MessageHandler } from 'src/app/common/common.service';
import { RelationInfo, RelationAction } from './relationinfo.type';
import { Message } from 'src/app/common/message.type';

@Injectable({
  providedIn: 'root'
})
export class RelationService extends CommonService {

  constructor(private logger: LoggerService, private http: HttpClient) {
    super();
  }

  // ===========================================================
  private _callDeleteRelation(id: number): Observable<any> {

    let url = PHP_API_SERVER + "/relation/delete.php";

    let options = {
      // params: new HttpParams().set("id", "" + id)
      body: { "id": "" + id }
    };

    return this.http.request<Message>('delete', url, options)
      .pipe(
        catchError(super.handleError)
      );
  }

  deleteRelation(relationIdToDelete: number, handler: MessageHandler): void {

    this._callDeleteRelation(relationIdToDelete).subscribe(
      this._createMessageObserver(handler)
    );
  }
  // ===========================================================

  //==============================================================
  private _callCreateInvitation(relationToCreate: object): Observable<any> {

    let url = PHP_API_SERVER + "/relation/create.php";
    return this.http.post<Message>(url, relationToCreate, this.httpOptionsHeaderJson)
      .pipe(catchError(super.handleError));
  }
  createInvitation(idperson: number, handler: MessageHandler): void {

    this._callCreateInvitation({ idperson: idperson, action: RelationAction.invitation })
      .subscribe(this._createMessageObserver(handler));
  }
  //==============================================================


  //==============================================================
  private _callActionUpdate(relationToUpdate: object): Observable<any> {

    let url = PHP_API_SERVER + "/relation/update.php";

    return this.http.put<Message>(url, relationToUpdate, this.httpOptionsHeaderJson)
      .pipe(catchError(super.handleError));
  }
  updateActionRelation(idrelation: number, action: string, handler: MessageHandler): any {
    this.logger.log("updateRelation() : " + action);
    this._callActionUpdate({ idrelation: idrelation, action: action }).subscribe(
      this._createMessageObserver(handler)
    );
  }
  //==============================================================

  //==============================================================
  private _callRelationInfo(idrelation: number): Observable<any> {

    let url = PHP_API_SERVER + "/relation/read.php";
    let options = {
      headers: HTTP_HEADER_URL,
      params: new HttpParams().set("id", idrelation + "")

    };
    return this.http.get<RelationInfo>(url, options)
      .pipe(catchError(super.handleError));

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

import { Injectable } from '@angular/core';
import { LoggerService } from '../../common/logger.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonService, PHP_API_SERVER, Handler, HTTP_HEADER_URL } from 'src/app/common/common.service';
import { RelationInfo } from './relationinfo.type';
import { Message } from 'src/app/common/message.type';

@Injectable({
  providedIn: 'root'
})
export class RelationService extends CommonService {

  constructor(private logger: LoggerService, private http: HttpClient) {
    super();
  }

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

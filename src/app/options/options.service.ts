import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonService, Handler, MessageHandler, TOMCAT_API_SERVER } from '../common/common.service';
import { Message } from '../common/message.type';
import { Option, OptionEnum } from './option.type';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  constructor(private http: HttpClient, private commonService: CommonService) { }

  //==================================================
  private _callModifyOption(option: Option): Observable<Message> {


    let url = TOMCAT_API_SERVER + "/option"

    return this.http.put<Message>(url, option, this.commonService.httpOptionsHeaderJson)
      .pipe(catchError(this.commonService.handleError));
  }


  modifyOption(option: Option, handler: MessageHandler): void {

    this._callModifyOption(option).subscribe(
      this.commonService._createMessageObserver(handler)
    );

  }
  //==================================================
  private _callGetListOfOptions(): Observable<Array<Option>> {

    let url = TOMCAT_API_SERVER + "/options";

    return this.http.get<Array<Option>>(url).pipe(catchError(this.commonService.handleError));
  }
  getListOfOptions(handler: OptionsHandler): void {

    this._callGetListOfOptions().subscribe(

      (list: Array<Option>) => handler.onGetList(list),
      (error: string) => this.commonService._propageErrorToHandler(error, handler)

    );

  }
  //==================================================


}


export interface OptionsHandler extends Handler {

  onGetList(liste: Option[]): void;

}


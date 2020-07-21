import { Injectable } from '@angular/core';
import { LoggerService } from '../common/logger.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PHP_API_SERVER, CommonService, MessageHandler, Handler, BoolResponseHandler, HTTP_HEADER_URL } from '../common/common.service';
import { Trajet } from '../trajets/trajet.type';
import { catchError, map } from 'rxjs/operators';
import { TrajetsHandler } from '../trajets/trajet.service';
import { Message, BoolResponse } from '../common/message.type';
import { User } from './user.type';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends CommonService {

  constructor(private logger: LoggerService, private http: HttpClient) {
    super();
  }

  // ============================================
  _callVerifyLogin(login: string): Observable<any> {

    let url = PHP_API_SERVER + "/account/verify/read.php";

    let options = {
      headers: HTTP_HEADER_URL,
      params: new HttpParams().set("login", login)

    };
    return this.http.get<BoolResponse>(url, options);

  }
  isLoginTaken(login: string): Observable<boolean> {

    return this._callVerifyLogin(login).
      pipe(map(bresp => bresp.retour));
  }
  verifyLogin(login: string, handler: BoolResponseHandler): void {
    this._callVerifyLogin(login).pipe(catchError(super.handleError)).subscribe({

      //next
      next: (data: BoolResponse) => handler.onResponse(data.retour),
      error: (e: Message) => handler.onError(e)
    });
  }
  // ============================================

  // ============================================
  private _callVerifyPseudo(pseudo: string): Observable<any> {

    let url = PHP_API_SERVER + "/account/verify/read.php";

    let options = {
      headers: HTTP_HEADER_URL,
      params: new HttpParams().set("pseudo", pseudo)

    };
    return this.http.get<BoolResponse>(url, options);

  }
  isPseudoTaken(pseudo: string): Observable<boolean> {

    return this._callVerifyPseudo(pseudo).
      pipe(map(bresp => bresp.retour));
  }
  verifyPseudo(pseudo: string, handler: BoolResponseHandler): void {
    this._callVerifyLogin(pseudo).pipe(catchError(super.handleError)).subscribe({

      //next
      next: (data: BoolResponse) => handler.onResponse(data.retour),
      error: (e: Message) => handler.onError(e)
    });
  }
  // ============================================


  // ============================================
  private _callLogout(): Observable<any> {

    let url = PHP_API_SERVER + "/login/delete.php";

    return this.http.delete<Message>(url, this.httpOptionsHeaderJson)
      .pipe(catchError(super.handleError));
  }

  logout(handler: MessageHandler): void {
    this.logger.log("logout");

    this._callLogout().subscribe(super._createMessageObserver(handler));
  }
  // ============================================


  // ============================================
  private _callLogin(userToLogin: User): Observable<any> {

    let url = PHP_API_SERVER + "/login/update.php";

    return this.http.put<User>(url, userToLogin, this.httpOptionsHeaderJson)
      .pipe(catchError(super.handleError));
  }

  login(login: string, password: string, handler: UserHandler): void {
    this.logger.log("login " + login);

    let user = new User();
    user.login = login;
    user.password = password;

    this._callLogin(user).subscribe(
      // next
      (data: User) => handler.onGetUser(data)
      ,
      // error
      (error: string) => this._propageErrorToHandler(error, handler)
    )
  }
  // ============================================
}

export interface UserHandler extends Handler {

  onGetUser(user?: User): void;
}

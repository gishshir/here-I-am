import { Injectable } from '@angular/core';
import { LoggerService } from '../common/logger.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PHP_API_SERVER, CommonService, MessageHandler, Handler } from '../common/common.service';
import { Trajet } from '../trajets/trajet.type';
import { catchError } from 'rxjs/operators';
import { TrajetsHandler } from '../trajets/trajet.service';
import { Message } from '../common/message.type';
import { User } from './user.type';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends CommonService {

  constructor(private logger: LoggerService, private http: HttpClient) {
    super();
  }


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

import { Injectable } from '@angular/core';
import { LoggerService } from '../common/logger.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PHP_API_SERVER, CommonService, MessageHandler, Handler, BoolResponseHandler, HTTP_HEADER_URL } from '../common/common.service';
import { Trajet } from '../trajets/trajet.type';
import { catchError, map } from 'rxjs/operators';
import { Message, BoolResponse } from '../common/message.type';
import { User } from './user.type';
import { AccountInfo } from './accountinfo.type';
import { Router } from '@angular/router';
import { NotificationService } from '../common/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends CommonService {

  private userLoggedIn: User;
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(private logger: LoggerService, private http: HttpClient, private router: Router,
    private notificationService: NotificationService) {
    super();
  }

  // ============================================
  _callCreateAccount(user: User, email: string): Observable<any> {

    let url = PHP_API_SERVER + "/account/create.php";

    let userToCreate = {

      login: user.login,
      password: user.password,
      pseudo: user.pseudo,
      email: email
    };

    return this.http.post<AccountInfo>(url, userToCreate, this.httpOptionsHeaderJson)
      .pipe(catchError(super.handleError));

  }
  creerCompte(user: User, email: string, handler: AccountInfoHandler): void {

    this._callCreateAccount(user, email).subscribe(
      // next
      (data: AccountInfo) => handler.onGetAccountInfo(data)
      ,
      // error
      (error: string) => this._propageErrorToHandler(error, handler)

    );

  }
  // ============================================


  // vérifie si il existe en Bdd un user avec ce login
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

  // vérifie si il existe en Bdd un user avec ce pseudo
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

    this._callLogout().subscribe({

      next: (m: Message) => {
        // lance un message pour l'ensemble de l'application
        this.notificationService.changeUser(null);
        this.userLoggedIn = null;
        handler.onMessage(m);
      },
      error: (e: Message) => handler.onError(e)
    });


  }
  // ============================================

  private _callUserLogged(): Observable<any> {

    let url = PHP_API_SERVER + "/login/read.php";

    return this.http.get<User>(url, this.httpOptionsHeaderJson)
      .pipe(catchError(super.handleError));

  }

  // appel au serveur pour savoir si l'utilisateur a ou pas une session ouverte.
  // ou bien retour de la variable isLoggedIn si définie
  isUserLoggedIn(): Observable<boolean> {

    // soit on connait la reponse
    if (this.userLoggedIn) {
      console.log("isLoggedIn: " + this.userLoggedIn.login);
      this.notificationService.changeUser(this.userLoggedIn.pseudo);
      return of(true);
    }

    // soit on appel le serveur
    return this._callUserLogged().pipe(
      map((user: User) => {
        console.log("Session ouverte pour user " + user.login);
        this.userLoggedIn = user;

        this.notificationService.changeUser(user.pseudo);
        return true;
      }),
      catchError(e => {

        console.log("Pas de session ouverte.");
        this.notificationService.changeUser(null);
        this.userLoggedIn = null;
        return of(false);
      })
    );

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

    let user = this.buildUser(login, password, null);

    this._callLogin(user).subscribe(
      // next
      (user: User) => {
        this.userLoggedIn = user;
        // lance un message pour l'ensemble de l'application
        this.notificationService.changeUser(user.pseudo);
        handler.onGetUser(user);
      }
      ,
      // error
      (error: string) => this._propageErrorToHandler(error, handler)
    )
  }
  // ============================================
  redirectAfterLogin() {
    if (this.redirectUrl) {
      console.log("redirectAfterLogin() --> " + this.redirectUrl);
      this.router.navigate([this.redirectUrl]);
      this.redirectUrl = null;
    } else {
      this.router.navigate(["/go-accueil"]);
    }
  }

  buildUser(login: string, password: string, pseudo: string): User {

    return {
      id: -1,
      login: login,
      password: password,
      pseudo: pseudo
    };

  }
}

export interface UserHandler extends Handler {

  onGetUser(user?: User): void;
}

export interface AccountInfoHandler extends Handler {

  onGetAccountInfo(accountinfo?: AccountInfo): void;
}
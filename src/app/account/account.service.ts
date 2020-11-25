import { Injectable, SecurityContext } from '@angular/core';
import { LoggerService } from '../common/logger.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CommonService, MessageHandler, Handler, BoolResponseHandler, HTTP_HEADER_URL, TOMCAT_API_SERVER } from '../common/common.service';
import { catchError, map } from 'rxjs/operators';
import { Message, BoolResponse } from '../common/message.type';
import { AuthenticationDto, CredentialsDto, User } from './user.type';
import { AccountInfo, AccountState } from './account.type';
import { Router } from '@angular/router';
import { NotificationService } from '../common/notification/notification.service';
import { DomSanitizer } from '@angular/platform-browser';

const NAME = "AccountService";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private jwtoken: string = null;
  getJWT(): string {
    return this.jwtoken;
  }
  private userLoggedIn: User;
  // on stocke les credentials pour le renouvellement du token
  private credentials: CredentialsDto;
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  private accountInfo: AccountInfo;


  constructor(private logger: LoggerService, private http: HttpClient, private router: Router,
    private sanitizer: DomSanitizer,
    private commonService: CommonService, private notificationService: NotificationService) { }

  getCurrentUser(): User {
    return this.userLoggedIn;
  }

  // TODO appeller le service
  getAccountInfo(handler: AccountInfoHandler) {

    let accountInfo: AccountInfo = {

      utilisateur: this.userLoggedIn,
      account: {
        id: -1,
        userid: -1,
        email: 'monemail@gmail.com',
        etat: AccountState.Open
      }
    };

    this.accountInfo = accountInfo;
    handler.onGetAccountInfo(accountInfo);
  }

  // ============================================
  _callCreateAccount(credentials: CredentialsDto, pseudo: string, email): Observable<any> {

    let url = TOMCAT_API_SERVER + "/account"

    let userToCreate: any = {

      login: credentials.login,
      password: credentials.password,
      pseudo: pseudo,
      email: email
    };

    return this.http.post<AccountInfo>(url, userToCreate, this.commonService.httpOptionsHeaderJson)
      .pipe(catchError(this.commonService.handleError));

  }
  creerCompte(credentials: CredentialsDto, pseudo: string, email: string, handler: AccountInfoHandler): void {

    this._callCreateAccount(credentials, pseudo, email).subscribe(
      // next
      (data: AccountInfo) => handler.onGetAccountInfo(data)
      ,
      // error
      (error: string) => this.commonService._propageErrorToHandler(error, handler)

    );

  }
  // ============================================


  // vérifie si il existe en Bdd un user avec ce login
  // ============================================
  _callVerifyLogin(login: string): Observable<any> {

    let url = TOMCAT_API_SERVER + "/account/verify/login/" + login;
    return this.http.get<BoolResponse>(url);

  }
  isLoginTaken(login: string): Observable<boolean> {

    return this._callVerifyLogin(login).
      pipe(map(bresp => bresp.retour));
  }
  verifyLogin(login: string, handler: BoolResponseHandler): void {
    this._callVerifyLogin(login).pipe(catchError(this.commonService.handleError)).subscribe({

      //next
      next: (data: BoolResponse) => handler.onResponse(data.retour),
      error: (e: Message) => handler.onError(e)
    });
  }
  // ============================================

  // vérifie si il existe en Bdd un user avec ce pseudo
  // ============================================
  private _callVerifyPseudo(pseudo: string): Observable<any> {

    pseudo = this.sanitizer.sanitize(SecurityContext.HTML, pseudo);
    let url = TOMCAT_API_SERVER + "/account/verify/pseudo/" + pseudo;

    return this.http.get<BoolResponse>(url);

  }

  isPseudoTaken(pseudo: string): Observable<boolean> {

    if (this.accountInfo && this.accountInfo.utilisateur.pseudo == pseudo) {
      return of(false);
    }
    return this._callVerifyPseudo(pseudo).
      pipe(map(bresp => bresp.retour));
  }
  verifyPseudo(pseudo: string, handler: BoolResponseHandler): void {
    this._callVerifyPseudo(pseudo).pipe(catchError(this.commonService.handleError)).subscribe({

      //next
      next: (data: BoolResponse) => handler.onResponse(data.retour),
      error: (e: Message) => handler.onError(e)
    });
  }
  // ============================================
  // vérifie si il existe en Bdd un user avec cet email
  // ============================================
  private _callVerifyEmail(email: string): Observable<any> {

    //pseudo = this.sanitizer.sanitize(SecurityContext.HTML, pseudo);
    let url = TOMCAT_API_SERVER + "/account/verify/email/" + email;
    return this.http.get<BoolResponse>(url);

  }
  isEmailTaken(email: string): Observable<boolean> {

    if (this.accountInfo && this.accountInfo.account.email == email) {
      return of(false);
    }
    return this._callVerifyEmail(email).
      pipe(map(bresp => bresp.retour));
  }
  verifyEmail(email: string, handler: BoolResponseHandler): void {
    this._callVerifyEmail(email).pipe(catchError(this.commonService.handleError)).subscribe({

      //next
      next: (data: BoolResponse) => handler.onResponse(data.retour),
      error: (e: Message) => handler.onError(e)
    });
  }
  // ============================================


  // ============================================
  private _callLogout(): Observable<any> {

    let url = TOMCAT_API_SERVER + "/logout"

    return this.http.delete<Message>(url, this.commonService.httpOptionsHeaderJson)
      .pipe(catchError(this.commonService.handleError));
  }

  logout(handler: MessageHandler): void {
    this.logger.log(NAME, "logout");


    this._callLogout().subscribe({

      next: (m: Message) => {
        // lance un message pour l'ensemble de l'application
        console.log("loggout next..");

        this.userLoggedIn = null;
        this.credentials = null;
        this.jwtoken = null;

        this.notificationService.changeUser(null);
        this.notificationService.informClosedSession(true);

        handler.onMessage(m);
      },
      error: (e: Message) => handler.onError(e)
    });


  }
  // ============================================

  private _callUserLogged(): Observable<any> {

    let url = TOMCAT_API_SERVER + "/user";

    return this.http.get<User>(url, this.commonService.httpOptionsHeaderJson)
      .pipe(catchError(this.commonService.handleError));

  }

  // appel au serveur pour savoir si l'utilisateur a ou pas une session ouverte.
  // ou bien retour de la variable isLoggedIn si définie
  isUserLoggedIn(forceControl: boolean): Observable<boolean> {

    console.log("isUserLoggedIn()...");

    // soit on connait la reponse
    if (!forceControl && this.userLoggedIn) {
      console.log("isLoggedIn: " + this.userLoggedIn.login);
      this.notificationService.changeUser(this.userLoggedIn);
      return of(true);
    }

    // soit on appel le serveur
    return this._callUserLogged().pipe(
      map((user: User) => {
        console.log("Session ouverte pour user " + user.login);
        this.userLoggedIn = user;

        this.notificationService.changeUser(user);
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

  // renouvellement du token automatique 
  private _subscribeRenewToken(): void {

    this.notificationService.invalidToken$.subscribe(

      (t: boolean) => {

        console.log("reconnect after invalid token...");
        if (this.credentials != null) {

          this.login(this.credentials.login, this.credentials.password, null);
          console.log("....reconnect after invalid token DONE");
        }
      }
    );

  }

  // ============================================
  private _callLogin(userToLogin: CredentialsDto): Observable<any> {

    let url = TOMCAT_API_SERVER + "/login";

    return this.http.put<AuthenticationDto>(url, userToLogin, this.commonService.httpOptionsHeaderJson)
      .pipe(catchError(this.commonService.handleError));
  }

  login(login: string, password: string, handler: UserHandler): void {
    this.logger.log(NAME, "login " + login);

    let credentials = this.buildCredentials(login, password);

    this._callLogin(credentials).subscribe(
      // next
      (auth: AuthenticationDto) => {
        this.credentials = credentials;
        this.userLoggedIn = auth.utilisateurDto;
        this.jwtoken = auth.jwtoken;

        if (handler != null) {
          // lance un message pour l'ensemble de l'application
          this.notificationService.changeUser(this.userLoggedIn);
          handler.onGetUser(this.userLoggedIn);

          this._subscribeRenewToken();
          this.notificationService.informInvalidToken(false);
        }
      }
      ,
      // error
      (error: string) => handler.onError({ error: true, msg: "login ou mot de passe incorrect!" })
    )
  }
  // ============================================
  redirectAfterLogin() {
    console.log("redirectAfterLogin() --> " + this.redirectUrl);

    if (this.redirectUrl) {
      this.router.navigate([this.redirectUrl]);
      this.redirectUrl = null;
    } else {
      this.router.navigate(["/go-accueil"]);
    }
  }



  buildCredentials(login: string, password: string): CredentialsDto {

    return {
      login: login,
      password: password
    };
  }

  buildUser(login: string, pseudo: string): User {
    return {
      login: login,
      pseudo: pseudo
    }
  }
}



export interface UserHandler extends Handler {

  onGetUser(user?: User): void;
}

export interface AccountInfoHandler extends Handler {

  onGetAccountInfo(accountinfo?: AccountInfo): void;
}
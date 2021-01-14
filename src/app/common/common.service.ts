import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, Observer } from 'rxjs';
import { Message } from './message.type';
import { NotificationService } from './notification/notification.service';
import { environment } from 'src/environments/environment';
import { LoggerService } from './logger.service';


export const HTTP_HEADER_JSON = new HttpHeaders({
  'Content-Type': 'application/json'
});
export const HTTP_HEADER_URL = new HttpHeaders({
  'Content-Type': 'application/x-www-form-urlencoded'
});

export enum NetworkState {

  started = "started",
  stopped = "stopped",
  pending = "pending",
  success = "success",
  error = "error"
}

//export const PHP_API_SERVER = environment.apiUrl;
export const TOMCAT_API_SERVER = environment.apiUrl;

// pour test avec tomcat localhost SSL
//"https://hereiam-tomcat.secure:8443/";

// eclipse tomcat embeded
//"https://localhost:444/";

const SESSION_CLOSED: string = "SESSION_CLOSED";
const TOKEN_TOO_OLD: string = "TOKEN_TOO_OLD";
export const ERREUR_500: string = "ERREUR_500";

const NAME = "CommonService";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  httpOptionsHeaderJson = {
    headers: HTTP_HEADER_JSON
  };


  constructor(private notificationService: NotificationService, private logger: LoggerService) {

    if (this.notificationService == undefined) {
      console.error("notification service undefined!");
    }
    if (this.logger == undefined) {
      console.error("logger service undefined!");
    }
  }


  /*
  * HttpErrorResponse
  * .error : body de la reponse - ex {"msg": "toto", "error": true} ou autre chose!
  * .headers: [header...]
  * .message: "<technique>"
  * .status: 400
  * .url: "http://..../update.php" par ex
  */
  handleError(httpError: HttpErrorResponse): Observable<never> {

    let message = "";
    let httpMessage = (httpError.error.message) ? httpError.error.message : httpError.message;

    if (httpError.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', httpError.error.message);
      this.logger.logError(NAME, "client side error: " + httpError.error.message);

    } else {

      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      let body: string = JSON.stringify(httpError.error);
      console.error(
        `Backend returned code ${httpError.status}`);

      // session fermée - utilisateur non authentifié
      // code 401 Unauthorized : voir si on peut renouveller le token
      if (httpError.status == 401) {
        if (httpMessage == "Token to be renewed!") {
          message = TOKEN_TOO_OLD;
        } else {
          message = SESSION_CLOSED;
        }
      }

      // message metier depuis api
      else if (httpError.status >= 400 && httpError.status < 500) {
        message = httpMessage;
      } else {
        message = ERREUR_500;
      }
    }
    // return an observable with a user-facing error message
    // call observer.error(...)
    if (this.logger) {
      this.logger.logError(NAME, message);
    }
    return throwError(message);
  }
  _propageErrorToHandler(error: string, handler?: Handler): void {

    if (error === SESSION_CLOSED) {
      this.notificationService.informClosedSession(true);
    } else if (error === TOKEN_TOO_OLD) {
      console.log("reconnexion automatique...");
      this.notificationService.informInvalidToken(true);
      return;
    } else if (error === ERREUR_500) {
      error = 'Erreur technique! consulter la sortie console';
    }
    if (handler) {
      let errorMsg = {
        msg: error,
        error: true
      };

      handler.onError(errorMsg);
    }
  }

  // observer générique envoyant des obj Message
  // et gérant proprement les erreurs
  _createMessageObserver(handler: MessageHandler): Observer<Message> {

    return {

      next: (resp: Message) => {
        handler.onMessage(resp);
      },
      error: (error: string) => {
        this._propageErrorToHandler(error, handler);
      },
      complete: () => { }

    }
  }
}

export interface Handler {
  onError(message: Message): void;
}

export interface MessageHandler extends Handler {

  onMessage(message: Message): void;
}

export interface BoolResponseHandler extends Handler {
  onResponse(value: boolean): void;
}
export interface StringResponseHandler extends Handler {
  onResponse(value: string): void;
}

export interface NumberResponseHandler extends Handler {
  onResponse(value: number): void;
}
import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, Observer } from 'rxjs';
import { Message } from './message.type';

const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

export const PHP_API_SERVER = "http://whereIAm.localhost";


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  protected httpOptions = HTTP_OPTIONS;

  /*
 * HttpErrorResponse
 * .error : body de la reponse - ex {"message": "toto", "error": true} ou autre chose!
 * .headers: [header...]
 * .message: "Http failure.... 400"
 * .status: 400
 * .url: "http://..../update.php" par ex
 */
  protected handleError(httpError: HttpErrorResponse): Observable<never> {

    let message = 'Erreur technique! consulter la sortie console';

    if (httpError.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', httpError.error.message);

    } else {

      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${httpError.status}, ` +
        `body was: ${httpError.error}`);

      // message metier depuis api
      if (httpError.status == 400 && httpError.error.message) {
        message = httpError.error.message;
      }
    }
    // return an observable with a user-facing error message
    // call observer.error(...)
    return throwError(message);
  }
  protected _propageErrorToHandler(error: string, handler?: Handler): void {

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
  protected _createMessageObserver(handler: MessageHandler): Observer<Message> {

    return {

      next: (resp: Message) => {
        handler.onMessage(resp);
      },
      error: (error: string) => {
        this._propageErrorToHandler(error, handler);
      },
      complete: () => console.log("complete")

    }
  }
}

export interface Handler {
  onError(message: Message): void;
}

export interface MessageHandler extends Handler {

  onMessage(message: Message): void;
}

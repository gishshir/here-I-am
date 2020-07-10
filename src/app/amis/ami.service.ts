import { Injectable } from '@angular/core';
import { AMIS } from './mock-amis';
import { LoggerService } from '../logger.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Ami } from './ami.type';
import { AmiState } from './ami.etat.enum';
import { PHP_API_SERVER } from '../tools.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AmiService {

  constructor(private logger:LoggerService, private http: HttpClient) { }

  // appel asynchrone
  getListeAmis() : Observable<any>{
    this.logger.log ("getListeAmis()");

    let url = PHP_API_SERVER + "/ami/read.php";

    return this.http.get<Ami[]>(url);

    //return AMIS;
  }

  updateAmi (amiToUpdate: Ami) : Observable<any> {

    this.logger.log ("updateEtatAmi()");

    let url = PHP_API_SERVER + "/ami/update.php";
  
    return this.http.put<Message>(url, amiToUpdate, httpOptions)
       .pipe (
         // call observer.error(...) si http code != 200
         catchError (this.handleError)
         // sinon call observer.next(body), puis observer.complete()
       );
  }

  /*
  * HttpErrorResponse
  * .error : body de la reponse - ex {"message": "toto", "error": true} ou autre chose!
  * .headers: [header...]
  * .message: "Http failure.... 400"
  * .status: 400
  * .url: "http://..../update.php" par ex
  */
  private handleError(httpError: HttpErrorResponse): Observable<never> {

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
  };

  getAmiState (etat : string) : AmiState {

    switch (etat) {

      case "Arret" : return AmiState.Arret;
      case "EnChemin" : return AmiState.EnChemin;
      case "Pause" : return AmiState.Pause;
      default: return AmiState.Arret;
    }

  }

  buildAmiFromJs (amijs : Ami) :Ami {

    let ami: Ami = {
           
      "id": amijs.id,
      "pseudo" : amijs.pseudo,
      "etat" : this.getAmiState (amijs.etat),
      "suivre" : amijs.suivre

     };
     return ami;
  }
}

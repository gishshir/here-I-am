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
  
    return this.http.put<Message>(url, amiToUpdate, httpOptions);
      /* .pipe (
         catchError (this.handleError)
       );*/
  }

  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
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

import { Injectable } from '@angular/core';
import { AMIS } from './mock-amis';
import { LoggerService } from '../common/logger.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Ami } from './ami.type';
import { AmiState } from './ami.etat.enum';
import { PHP_API_SERVER } from '../common/tools.service';
import { CommonService } from '../common/common.service';
import { Message } from '../common/message.type';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AmiService extends CommonService{

  constructor(private logger:LoggerService, private http: HttpClient) {
    super();
   }

  // appel asynchrone
  getListeAmis() : Observable<any>{
    this.logger.log ("getListeAmis()");

    let url = PHP_API_SERVER + "/ami/read.php";

    return this.http.get<Ami[]>(url)
    .pipe (catchError (super.handleError));

    //return AMIS;
  }

  updateAmi (amiToUpdate: Ami) : Observable<any> {

    this.logger.log ("updateEtatAmi()");

    let url = PHP_API_SERVER + "/ami/update.php";
  
    return this.http.put<Message>(url, amiToUpdate, httpOptions)
       .pipe (
         // call observer.error(...) si http code != 200
         catchError (super.handleError)
         // sinon call observer.next(body), puis observer.complete()
       );
  }

 

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

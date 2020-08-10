import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Trajet } from 'src/app/trajets/trajet.type';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {
    console.log("notification service constructor");
  }

  coucou() {
    console.log("coucou");
  }

  //--------------------------------------------------
  // Observable string source
  private networkUsageSource = new Subject<boolean>();
  // observable string streams
  networkUsage$ = this.networkUsageSource.asObservable();

  // services message commands
  useNetwork(usage: boolean) {
    console.log("NotificationService#useNetword() " + usage);
    this.networkUsageSource.next(usage);
  }
  //--------------------------------------------------

  //--------------------------------------------------
  // Observable string source
  private changeUserSource = new Subject<string>();
  // observable string streams
  changeUser$ = this.changeUserSource.asObservable();

  // services message commands
  changeUser(pseudo?: string) {
    console.log("NotificationService#changeUser() " + pseudo);
    this.changeUserSource.next(pseudo);
  }
  //--------------------------------------------------


  //--------------------------------------------------
  //Observable string source
  private closedSessionSource = new Subject<boolean>();
  // observable string streams
  closedSession$ = this.closedSessionSource.asObservable();

  informClosedSession(value: boolean) {
    console.log("NotificationService#informClosedSession() " + value);
    this.closedSessionSource.next(value);
  }
  //--------------------------------------------------


  //---------------------------------------------------------------
  // notification d'un changement dans le trajet de mon ami en cours
  // soit demarrage d'un nouveau trajet
  // soit changement etat du trajet en cours
  private amiTrajetSource = new Subject<Trajet>();
  // observable Trajet streams
  amiTrajet$ = this.amiTrajetSource.asObservable();

  changeAmiTrajet(value: Trajet) {
    console.log("NotificationService#changeAmiTrajet() " + value);
    this.amiTrajetSource.next(value);
  }
  //---------------------------------------------------------------

  //---------------------------------------------------------------
  // notification d'un changement dans mon dernier trajet
  // soit demarrage d'un nouveau trajet
  // soit changement etat du trajet en cours
  private monTrajetSource = new Subject<Trajet>();
  // observable Trajet streams
  monTrajet$ = this.monTrajetSource.asObservable();

  changeMonTrajet(value: Trajet) {
    console.log("NotificationService#changeMonTrajet() " + value);
    this.monTrajetSource.next(value);
  }
  //---------------------------------------------------------------


}

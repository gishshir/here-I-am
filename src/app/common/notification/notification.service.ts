import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Trajet } from 'src/app/trajets/trajet.type';
import { AppPosition } from 'src/app/trajets/position.type';
import { Message } from '../message.type';
import { GeolocationState } from 'src/app/geolocation/geolocation.service';
import { NetworkState } from '../common.service';

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
  // Observable NetworkState source
  private networkUsageSource = new Subject<NetworkState>();
  // observable NetworkState streams
  networkUsage$ = this.networkUsageSource.asObservable();

  // services message commands
  useNetwork(state: NetworkState) {
    console.log("NotificationService#useNetwork() " + state);
    this.networkUsageSource.next(state);
  }
  //--------------------------------------------------

  //--------------------------------------------------
  // Observable Message source
  private emitGeoMessageSource = new Subject<Message>();
  // observable Message streams
  emitGeoMessage$ = this.emitGeoMessageSource.asObservable();

  // services message commands
  emitGeoMessage(message?: Message) {
    console.log("NotificationService#emitGeoMessage() " + message.msg);
    this.emitGeoMessageSource.next(message);
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
  //Observable boolean source
  private closedSessionSource = new Subject<boolean>();
  // observable boolean streams
  closedSession$ = this.closedSessionSource.asObservable();

  informClosedSession(value: boolean) {
    console.log("NotificationService#informClosedSession() " + value);
    this.closedSessionSource.next(value);
  }
  //--------------------------------------------------

  //--------------------------------------------------
  //Observable boolean source
  private invalidTokenSource = new Subject<boolean>();
  // observable boolean streams
  invalidToken$ = this.invalidTokenSource.asObservable();

  informInvalidToken(value: boolean) {
    console.log("NotificationService#informInvalidToken() " + value);
    this.invalidTokenSource.next(value);
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
    console.log("NotificationService#changeAmiTrajet() " + value.id);
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
    console.log("NotificationService#changeMonTrajet() " + value.id + " - " + value.etat);
    this.monTrajetSource.next(value);
  }
  //---------------------------------------------------------------

  //---------------------------------------------------------------
  // notification d'une nouvelle position de mon trajet
  private maPositionSource = new Subject<AppPosition>();
  // observable AppPosition streams
  maPosition$ = this.maPositionSource.asObservable();

  changeMaPosition(value: AppPosition) {
    console.log("NotificationService#changeMaPosition() " + value.timestamp);
    this.maPositionSource.next(value);
  }
  //---------------------------------------------------------------

  //---------------------------------------------------------------
  // notification de l'activation de la geoposition
  private geolocationSource = new Subject<GeolocationState>();
  // observable boolean streams
  geolocation$ = this.geolocationSource.asObservable();

  activateGeolocation(state: GeolocationState) {
    console.log("NotificationService#activateGeolocation() " + state);
    this.geolocationSource.next(state);
  }
  //---------------------------------------------------------------


}

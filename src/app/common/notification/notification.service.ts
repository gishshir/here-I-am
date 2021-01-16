import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Trajet } from 'src/app/trajets/trajet.type';
import { AppPosition } from 'src/app/trajets/position.type';
import { Message } from '../message.type';
import { GeolocationState } from 'src/app/geolocation/geolocation.service';
import { NetworkState } from '../common.service';
import { User } from 'src/app/account/user.type';

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
  // Observable User source
  private changeUserSource = new Subject<User | null>();
  // observable User streams
  changeUser$ = this.changeUserSource.asObservable();

  // services message commands
  changeUser(user: User | null) {
    console.log("NotificationService#changeUser() " + (user ? user.pseudo : null));
    this.changeUserSource.next(user);
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
  // notification d'une nouvelle position de mon trajet ou de celui de mon ami
  // c'est le trajetid porté par AppPosition qui permet de filtrer les notifications
  private unePositionSource = new Subject<AppPosition>();
  // observable AppPosition streams
  unePosition$ = this.unePositionSource.asObservable();

  changeUnePosition(value: AppPosition) {
    console.log("NotificationService#changeUnePosition() " + value.timestamp);
    this.unePositionSource.next(value);
  }

  //---------------------------------------------------------------

  //---------------------------------------------------------------
  // notification pas de position connue pour mon trajet ou de celui de mon ami
  // c'est le trajetid porté par AppPosition qui permet de filtrer les notifications
  private noPositionSource = new Subject<number>();
  // observable number streams
  noPosition$ = this.noPositionSource.asObservable();

  // a tester
  informNoPosition(trajetid: number) {
    console.log("NotificationService#informNoPosition() - trajetid: " + trajetid);
    this.noPositionSource.next(trajetid);
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

  //---------------------------------------------------------------
  // notification de l'activation du journal interne
  private journalSource = new Subject<boolean>();
  // observable boolean streams
  journal$ = this.journalSource.asObservable();

  activateJournal(activate: boolean) {
    console.log("NotificationService#activateJournal() " + activate);
    this.journalSource.next(activate);
  }
  //---------------------------------------------------------------

  //--------------------------------------------------
  //Observable boolean source
  private lockScreenSource = new Subject<boolean>();
  // observable boolean streams
  lockScreen$ = this.lockScreenSource.asObservable();

  activateLockScreen(value: boolean) {
    console.log("NotificationService#activateLockScreen() " + value);
    this.lockScreenSource.next(value);
  }
  //--------------------------------------------------
}

import { Injectable, OnDestroy, OnInit, Inject, HostListener } from '@angular/core';
import { NotificationService } from '../common/notification/notification.service';
import { Message } from '../common/message.type';
import { Trajet, TrajetState, TrajetMeans } from '../trajets/trajet.type';
import { AppPosition } from '../trajets/position.type';
import { PositionService } from './position.service';
import { NetworkState } from '../common/common.service';
import { AppStorageService } from '../trajets/storage.service';

export enum GeolocationState {

  started = "started",
  stopped = "stopped",
  pending = "pending",
  succes = "succes",
  error = "error"
}
const TIMEOUT: number = 29000;

/*
* Service gerant la localisation de mon trajet en cours
* en utilisant l'API navigator geolocation si disponible
* propagation par notification
*/
@Injectable({
  providedIn: 'root'
})
export class GeolocationService implements OnInit, OnDestroy {

  // determine si la geolocation est possible ou non sur le navigateur/systeme
  private geolocation: boolean;
  //private pid: number = -1;
  private trajetid: number = -1;

  // token sur le timer
  private timerid: number = -1;

  private frequenceRafraichissement: number = 30000;
  private facteurMoyenTransport: number = 1;

  private geoState: GeolocationState = GeolocationState.stopped;
  private geoMessage: Message;


  private currentPosition: AppPosition;


  private currentTimeout: number = TIMEOUT;
  private geoOptions = this.buildGeoOptions();
  private buildGeoOptions(): any {
    return {
      enableHighAccuracy: true,
      maximumAge: 20000,
      timeout: this.currentTimeout
    };
  }

  constructor(private notificationService: NotificationService,
    private positionService: PositionService, private localStorage: AppStorageService) {
    if ("geolocation" in navigator) {

      console.log("geolocation active dans le navigateur!");
      this.geolocation = true;

      // abonnement à une modification de mon trajet
      //nouveau | changement etat | changement moyen transport
      this.notificationService.monTrajet$.subscribe(
        (t: Trajet) => this.onChangeMonTrajet(t)
      )

      // abonnement a un logout
      this.notificationService.closedSession$.subscribe(
        (v: boolean) => this.clearWatch()
      )

    } else {
      console.log("fonction geolocation n'existe pas sur ce navigateur!");
      this.geolocation = false;
    }
  }

  ngOnInit(): void {

  }
  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    this.clearWatch();
  }



  getCurrentPosition(): AppPosition {
    return this.currentPosition;
  }
  private clearCurrentPosition(): void {
    this.currentPosition = null;
  }

  getCurrentTrajetid(): number {
    return this.trajetid;
  }

  // nouveau trajet ou
  // changement etat ou moyen de transport
  private onChangeMonTrajet(trajet: Trajet) {
    console.log("GeolocationService#onChangeTrajet");

    // si changement de trajetid on réinitialise la current position
    if (this.trajetid && this.trajetid != trajet.id) {
      this.clearCurrentPosition();
    }

    this.trajetid = trajet ? trajet.id : -1;


    // si trajet en cours
    if (trajet && trajet.etat != TrajetState.ended) {

      // on ralentit la mesure de position si on est en pause
      // on ralentit également selon le moyen de transport
      let frequence = this.calculerFrequence(trajet);
      this.restart(frequence);
    } else {

      // trajet ended
      this.clearWatch();

      if (this.trajetid > 0) {
        // sauvegarde sur le serveur de la liste complète
        this.positionService.clearListPositionsInLocalStorageForTrajet(-1);
        this.positionService.insererListePositionAndClearLocalStorage();
      }

    }
  }

  // la fréquence de rafraichissement dépend de l'état et
  // du moyen de transport.
  private calculerFrequence(trajet: Trajet): number {

    let ralentir = 1;
    switch (trajet.etat) {
      case TrajetState.started: ralentir = 1; break;
      case TrajetState.pausing: ralentir = 4; break;
      case TrajetState.ended: ralentir = 0; break;
    }

    let facteur = 1;
    switch (trajet.mean) {

      case TrajetMeans.pied: facteur = 4; break;
      case TrajetMeans.velo: facteur = 2; break;
      case TrajetMeans.avion: facteur = 0.5; break;
      default: facteur = 1; break;
    }


    return this.frequenceRafraichissement * ralentir * facteur;
  }

  private restart(frequence: number) {
    this.clearWatch();
    this.startWatch(frequence);
  }


  // utilisation d'un timer à la place de l'API de geolocation
  // qui n'est pas fiable
  private startWatch(frequence: number) {

    if (this.geolocation && this.timerid < 0) {
      console.log("startWatch(): toutes les " + (frequence / 1000) + " s");

      this.activateGeolocation(GeolocationState.started);
      this.findCurrentPosition();

      //rafraichir position toutes les 30s 
      this.timerid = window.setInterval(() => {

        this.findCurrentPosition();

      }, frequence);
      console.log("geolocation timerid: " + this.timerid);
    }

  }

  /**
   * force la recherche d'une position 
   */
  forceCurrentPosition(): void {

    console.log("force current position... geoState: " + this.geoState);
    this.findCurrentPosition();

  }
  private activateGeolocation(state: GeolocationState): void {
    this.geoState = state;
    this.notificationService.activateGeolocation(state);
  }
  private findCurrentPosition(): void {
    console.log("findCurrentPosition()");
    if (this.geoState == GeolocationState.pending) {
      return;
    }
    this.activateGeolocation(GeolocationState.pending);
    navigator.geolocation.getCurrentPosition(
      (position: Position) => this.geo_success(position),
      (error: PositionError) => this.geo_error(error),
      this.geoOptions);
  }

  private clearWatch() {

    if (this.timerid >= 0) {

      this.activateGeolocation(GeolocationState.stopped);
      this.notificationService.useNetwork(NetworkState.stopped);
      console.log("clearWatch()");
      clearInterval(this.timerid);
      this.timerid = -1;
    }

  }

  private geo_success(position: Position): void {

    this.geoMessage = null;
    this.activateGeolocation(GeolocationState.succes);
    this.decrementsTimeout();

    let sameTimestamp: boolean = false;
    let timestampSec = Math.floor(position.timestamp / 1000);

    if (this.currentPosition && this.currentPosition.timestamp == timestampSec) {
      sameTimestamp = true;
    }
    console.log("geo_success - TS (sec): " + timestampSec);
    this.currentPosition = {

      trajetid: this.trajetid,
      latitude: position.coords.latitude + "",
      longitude: position.coords.longitude + "",
      timestamp: timestampSec,
      locale: true
    }

    this.notificationService.changeUnePosition(this.currentPosition);

    // attention de ne pas enregistrer deux fois le meme timestamp!
    if (sameTimestamp) {
      return;
    }
    if (this.trajetid > 0) {

      console.log("appel du service insererCurrentAndListePositionAndClearLocalStorage()...");
      this.notificationService.useNetwork(NetworkState.pending);
      this.positionService.insererCurrentAndListePositionAndClearLocalStorage(this.currentPosition, {

        onMessage: (m: Message) => {
          console.log(m.msg);
          this.notificationService.useNetwork(NetworkState.success);
        },
        onError: (e: Message) => {
          console.log(e.msg);
          this.notificationService.useNetwork(NetworkState.error);
        }
      });
    } else {
      // trajet non connu en BDD, on garde la position en local
      this.storePosition(this.currentPosition);
    }


  }
  getGeoMessage(): Message {
    return this.geoMessage;
  }
  private incrementsTimeout(): void {

    let max = TIMEOUT * 4;
    if (this.currentTimeout < max) {
      this.currentTimeout += TIMEOUT;
      this.geoOptions = this.buildGeoOptions();
      this.restart(this.frequenceRafraichissement);
    }

  }
  private decrementsTimeout(): void {

    if (this.currentTimeout > TIMEOUT) {
      this.currentTimeout -= TIMEOUT;
      this.geoOptions = this.buildGeoOptions();
      this.restart(this.frequenceRafraichissement);
    }
  }

  private geo_error(error: PositionError) {

    console.log("Position inconnue! (" + error.code + " - " + error.message + ")");
    this.activateGeolocation(GeolocationState.error);

    let message = null;
    switch (error.code) {

      case 1: message = "La géolocalisation n'est pas activée sur votre appareil!"; break;
      case 2: message = "La position ne peut être déterminée à cause d'une erreur technique!"; break;
      case 3: {
        message = "La position prend trop de temps à être déterminée!";
        this.incrementsTimeout();
        break;
      }
    }
    if (message) {
      this.geoMessage = {
        error: true,
        msg: message
      }
      this.notificationService.emitGeoMessage(this.geoMessage);
    }

  }

  // stockage dans le LocalStorage
  private storePosition(appPosition: AppPosition): void {

    if (appPosition) {

      let listPositions = this.localStorage.restoreCurrentPositions();
      listPositions.push(appPosition);
      this.localStorage.storeCurrentPositions(listPositions);
    }

  }

}


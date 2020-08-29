import { Injectable, OnDestroy, OnInit, Inject, HostListener } from '@angular/core';
import { NotificationService } from '../common/notification/notification.service';
import { Message } from '../common/message.type';
import { Trajet, TrajetState, TrajetMeans } from '../trajets/trajet.type';
import { AppPosition } from '../trajets/position.type';
import { PositionService } from './position.service';

/*
* Service gerant la localisation du trajet en cours
* en utilisant l'API navigator geolocation si disponible
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


  private currentPosition: AppPosition;
  // stockage en mémoire de la  liste des positions
  private listPositions: Array<AppPosition>;

  private geo_options = {
    enableHighAccuracy: true,
    maximumAge: 20000,
    timeout: 29000
  };

  constructor(private notificationService: NotificationService,
    private positionService: PositionService) {
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
        (v: boolean) => this.clearWatchAndSave()
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
    this.clearWatchAndSave();
  }

  private clearWatchAndSave(): void {
    this.clearWatch();
    this.positionService.saveListPositionsToLocalStorage(this.trajetid, this.listPositions);
  }

  getCurrentPosition(): AppPosition {
    return this.currentPosition;
  }


  private onChangeMonTrajet(trajet: Trajet) {
    console.log("GeolocationService#onChangeTrajet");

    let newtrajet = trajet && this.trajetid != trajet.id;
    this.trajetid = trajet ? trajet.id : -1;

    if (trajet && trajet.etat != TrajetState.ended) {
      if (newtrajet) {
        this.listPositions = this.positionService.restoreListePositionsFromLocalStorage(this.trajetid);
      }
      // on ralentit la mesure de position si on est en pause
      // on ralentit également selon le moyen de transport
      let frequence = this.calculerFrequence(trajet);
      this.restart(frequence);
    } else {

      // trajet ended
      this.clearWatchAndSave();

      // sauvegarde sur le serveur de la liste complète
      this.positionService.insererListePositionAndClearLocalStorage(this.trajetid, this.listPositions);

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

      this.notificationService.activateGeolocation(true);
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
   * si le timer de la geolocation n'est pas en route.
   */
  forceCurrentPosition(): boolean {

    console.log("force current position...");
    if (this.timerid == -1) {
      this.findCurrentPosition();
      return true;
    }

    return false;
  }
  private findCurrentPosition(): void {

    navigator.geolocation.getCurrentPosition(
      (position: Position) => this.geo_success(position),
      (error: PositionError) => this.geo_error(error),
      this.geo_options);
  }

  private clearWatch() {

    if (this.timerid >= 0) {

      this.notificationService.activateGeolocation(false);
      this.notificationService.useNetwork(false);
      console.log("clearWatch()");
      clearInterval(this.timerid);
      this.timerid = -1;
    }

  }

  private geo_success(position: Position): void {

    // ne pas soliciter trop le reseau
    let timestampSec = Math.floor(position.timestamp / 1000);
    console.log("geo_success - TS (sec): " + timestampSec);


    if (this.currentPosition &&
      (timestampSec - this.currentPosition.timestamp < 30)) {
      return;
    }

    this.currentPosition = {

      trajetid: this.trajetid,
      latitude: position.coords.latitude + "",
      longitude: position.coords.longitude + "",
      timestamp: timestampSec
    }

    this.storePosition(this.currentPosition);
    this.notificationService.changeMaPosition(this.currentPosition);

    if (this.trajetid > 0) {
      console.log("appel du service insererNouvellePosition()...");
      this.positionService.insererNouvellePosition(this.currentPosition, {
        onMessage: (m: Message) => {
          console.log(m.msg);
          this.notificationService.useNetwork(true);
        },
        onError: (e: Message) => {
          console.log(e.msg);
          this.notificationService.useNetwork(false);
        }
      });
    }


  }
  private geo_error(error: PositionError) {

    console.log("Position inconnue! (" + error.code + " - " + error.message + ")");
  }

  // stockage en mémoire et dans le LocalStorage
  private storePosition(appPosition: AppPosition): void {

    if (appPosition && appPosition.trajetid > 0) {

      this.listPositions.push(appPosition);
      this.positionService.saveListPositionsToLocalStorage(this.trajetid, this.listPositions);
    }

  }

}


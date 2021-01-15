import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../common/notification/notification.service';
import { Message } from '../common/message.type';
import { AppPosition } from '../trajets/position.type';
import { GeolocationService } from './geolocation.service';
import { ToolsService } from '../common/tools.service';
import { Geoportail } from './geoportail.type';
import { PositionService } from './position.service';

/*
* composant interne utilise dans
* - dialog-geolocation
* - trajet-geolocation
* abonné aux changements de positions (gps)
* la connaissance du trajet en cours est nécessaire
* pour filtrer les positions
**/
@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit, OnDestroy {


  @Input() titre: string = "Ma position actuelle";
  @Input() ami: boolean = false;


  // bouton supplémentaire facultatif : exemple fermer
  @Input() actionButton: string;
  @Output() eventClickAction = new EventEmitter<boolean>();

  appPosition: AppPosition;
  geoMessage: Message;
  waiting: boolean = true;

  private geoportail: Geoportail;

  // url pour voir la localisation sur google maps ou geoportail
  url: string;

  private _trajetid: number = -1;
  // important pour distinguer les positions à prendre en compte
  @Input() set trajetid(trajetid: number) {
    this._trajetid = trajetid;
    console.log("set trajetid: " + this._trajetid);
    this.appPosition = null;
    this.geoMessage = null;
    this.url = null;
    this.waiting = true;
    this.createOrUpdateGeoportail();

  }
  // determine si les positions à afficher sont d'origine locale (GPS) our remote (BDD)
  @Input() locale: boolean = true;

  constructor(private geolocationService: GeolocationService,
    private notificationService: NotificationService, private positionService: PositionService,
    private tools: ToolsService) {

    // s'abonne aux evenements de changement de position
    this.substribeChangeAndNoPosition();

    // abonnement aux evenements de geolocalisation
    this.notificationService.emitGeoMessage$.subscribe(
      (m: Message) => this.geoMessage = m
    );
  }

  private substribeChangeAndNoPosition() {

    // s'abonne aux evenements de changement de position
    this.notificationService.unePosition$.subscribe(
      (p: AppPosition) => this.setPosition(p)

    );
    // s'abonne aux evenements de changement de pas de  position connue!
    this.notificationService.noPosition$.subscribe(
      (trajetid: number) => this.noPosition(trajetid)
    );

  }

  private buildUrl(): void {
    if (this.geoportail) {
      console.log("open geoportail: " + this.geoportail.url);
      this.url = this.geoportail.url;
    } else if (this.appPosition) {
      this.url = this.positionService.buildUrlToMaps(this.appPosition);
    }
  }
  openMaps(): void {
    if (this.url) {
      this.tools.openNewWindow(this.url);
    }
  }

  // click sur le bouton facultatif
  clickAction(): void {
    this.eventClickAction.emit(true);
  }

  private noPosition(trajetid: number): void {

    if (trajetid == this._trajetid) {
      console.log("Pas de position pour le trajet: " + trajetid);
      this.appPosition = null;
      this.waiting = false;
    }
  }
  private setPosition(p: AppPosition): void {

    console.log("setPosition...");
    this.waiting = false;

    // Filtrage pour savoir si on utilise ou pas cette position dans le component
    let keepPosition = false;

    // si trajetid > 0 on filtre les positions sur le paramètre trajetid
    if (this._trajetid && this._trajetid > 0) {

      keepPosition = p && this._trajetid == p.trajetid;

    } else {

      // sinon on filtre sur la variable 'locale'
      keepPosition = p && this.locale == p.locale;

    }

    if (keepPosition) {

      console.log("set position: [" + p.trajetid + "] - " + p.timestamp);

      this.appPosition = p;
      this.buildUrl();
      this.geoMessage = this.geolocationService.getGeoMessage();

    }

  }

  // dans tous les cas
  private createOrUpdateGeoportail(): void {

    // on ne fait rien si le trajet n'est pas connu
    if (this._trajetid < 0) {
      return;
    }

    // on ne fait rien si on a déjà l'info pour le meme trajet
    if (this.geoportail && this._trajetid && this.geoportail.trajetid == this._trajetid) {
      console.log("... createOrUpdateGeoportail() non nécessaire!");
      return;
    }

    this.geoportail = null;
    if (this._trajetid && this._trajetid > -1) {
      this.positionService.createOrUpdateGeoportail(this._trajetid, this.ami, {

        onGetGeoportailInfo: (g: Geoportail) => {
          this.geoportail = g;
          this.buildUrl();
        },
        onError: (e: Message) => {
          console.log("createOrUpdateGeoportail: " + e.msg);
          this.url = null;
        }
      });
    }
  }


  ngOnInit(): void {
  }

  ngOnDestroy() {

  }

  displayDate(): string {

    if (this.appPosition) {
      return this.tools.formatDateJourMoisYY(this.appPosition.timestamp);
    } else {
      return "";
    }
  }

  displayTime(): string {

    if (this.appPosition) {
      return this.tools.formatTime(this.appPosition.timestamp);
    } else {
      return "";
    }
  }


}

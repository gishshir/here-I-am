import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Trajet, TrajetState } from 'src/app/trajets/trajet.type';
import { Message } from 'src/app/common/message.type';
import { AppPosition } from 'src/app/trajets/position.type';
import { NotificationService } from 'src/app/common/notification/notification.service';
import { ToolsService } from 'src/app/common/tools.service';
import { PositionService } from 'src/app/geolocation/position.service';
import { Geoportail } from 'src/app/geoportail/geoportail.type';
import { NetworkState } from 'src/app/common/common.service';

@Component({
  selector: 'app-ami-geolocation',
  templateUrl: './ami-geolocation.component.html',
  styleUrls: ['./ami-geolocation.component.scss']
})
export class AmiGeolocationComponent implements OnInit, OnDestroy {

  @Input()
  set amiTrajet(trajet: Trajet) {
    this._amiTrajet = trajet;
    this.changeAmiTrajet();
  }

  @Output() eventMessage = new EventEmitter<Message>();

  appPosition: AppPosition;
  //private urlToMaps: string;
  // private urlToGeoportail: string;
  // gpxfile: string;

  geoportail: Geoportail;
  titre: string = "Position de mon ami(e)";
  url: string;

  private _amiTrajet: Trajet;

  // token sur le timer
  private timerid: number = -1;

  constructor(private positionService: PositionService, private notificationService: NotificationService,
    private tools: ToolsService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
  // openMaps() {
  //   if (this.geoportail) {
  //     this.tools.openNewWindow(this.geoportail.url);
  //   } else if (this.urlToMaps) {
  //     this.tools.openNewWindow(this.urlToMaps);
  //   }
  // }

  // displayDate(): string {

  //   if (this.appPosition) {
  //     return this.tools.formatDateJourMoisYY(this.appPosition.timestamp);
  //   } else {
  //     return "";
  //   }
  // }

  // displayTime(): string {

  //   if (this.appPosition) {
  //     return this.tools.formatTime(this.appPosition.timestamp);
  //   } else {
  //     return "";
  //   }
  // }

  createOrUpdateGeoportail() {

    // on ne fait rien si on a déjà l'info pour le meme trajet
    if (this.geoportail && this._amiTrajet && this.geoportail.trajetid == this._amiTrajet.id) {
      console.log("... createOrUpdateGeoportail() non nécessaire!");
      return;
    }

    // sinon on cherche l'info en remote...
    this.geoportail = null;
    if (this._amiTrajet) {
      this.positionService.createOrUpdateGeoportail(this._amiTrajet.id, true, {

        onGetGeoportailInfo: (g: Geoportail) => {
          this.geoportail = g;
          this.url = g.url;
        },
        onError: (e: Message) => console.log(e.msg)
      });
    }
  }

  download() {
    if (this.geoportail) {
      this.positionService.downloadGpxfile(this.geoportail.gpxfile, {
        onMessage: (m: Message) => this.eventMessage.emit(m),
        onError: (e: Message) => this.eventMessage.emit(e)
      });
    }
  }

  // demarre timer si necessaire
  private startTimer() {
    if (this.timerid == -1) {
      console.log("startTimer()");
      this.notificationService.useNetwork(NetworkState.started);

      // rafraichir position toutes les 30s 
      this.timerid = window.setInterval(() => {

        this.findAmiTrajetPosition();
      }, 30000);

    }
  }
  private stopTimer() {
    console.log("stopTimer()");
    this.notificationService.useNetwork(NetworkState.stopped);
    if (this.timerid >= 0) {
      clearInterval(this.timerid);
      this.timerid = -1;
    }
  }

  private changeAmiTrajet(): void {

    if (this._amiTrajet) {

      if (this.appPosition == undefined) {
        this.findAmiTrajetPosition();
      }
      // depuis 27/10 : acces à geoportail dans tous les cas
      this.createOrUpdateGeoportail();
      switch (this._amiTrajet.etat) {

        case TrajetState.started: this.startTimer(); break;

        case TrajetState.pausing:
        case TrajetState.ended: {
          this.stopTimer();
          this.titre = "Dernière position connue";
        }
      }

    }
    else {
      this.appPosition = null;
    }

  }
  private findAmiTrajetPosition(): void {

    console.log("findAmiTrajetPosition()");
    this.notificationService.useNetwork(NetworkState.pending);
    this.positionService.findAmiTrajetLastPosition(this._amiTrajet.id, {

      onGetPosition: (p: AppPosition) => {
        this.appPosition = p;
        //this.url = this.positionService.buildUrlToMaps(p);
        this.notificationService.useNetwork(NetworkState.success);
        this.notificationService.changeMaPosition(p);
      },
      onError: (e: Message) => {
        console.log(e.msg);
        this.notificationService.useNetwork(NetworkState.error);
      }
    });


  }


}

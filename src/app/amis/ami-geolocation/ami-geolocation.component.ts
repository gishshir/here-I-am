import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Trajet, TrajetState } from 'src/app/trajets/trajet.type';
import { Message } from 'src/app/common/message.type';
import { AppPosition } from 'src/app/trajets/position.type';
import { NotificationService } from 'src/app/common/notification/notification.service';
import { ToolsService } from 'src/app/common/tools.service';
import { PositionService } from 'src/app/geolocation/position.service';

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
  urlToMaps: string;
  gpxfile: string;
  titre: string = "Position de mon ami(e)";

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
  openMaps() {
    this.tools.openNewWindow(this.urlToMaps);
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

  createGpxFile() {
    this.gpxfile = null;
    if (this._amiTrajet && this._amiTrajet.etat == TrajetState.ended) {
      this.positionService.createGpxfile(this._amiTrajet.id, {

        onResponse: (f: string) => this.gpxfile = f,
        onError: (e: Message) => console.log(e.msg)
      });
    }
  }

  download() {
    this.positionService.downloadGpxfile(this.gpxfile, {
      onMessage: (m: Message) => this.eventMessage.emit(m),
      onError: (e: Message) => this.eventMessage.emit(e)
    })
  }

  // demarre timer si necessaire
  private startTimer() {
    if (this.timerid == -1) {
      console.log("startTimer()");
      this.notificationService.useNetwork(true);

      // rafraichir position toutes les 30s 
      this.timerid = window.setInterval(() => {

        this.findAmiTrajetPosition();
      }, 30000);

    }
  }
  private stopTimer() {
    console.log("stopTimer()");
    this.notificationService.useNetwork(false);
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
      switch (this._amiTrajet.etat) {

        case TrajetState.started: this.startTimer(); break;

        case TrajetState.pausing:
        case TrajetState.ended: {
          this.stopTimer();
          this.createGpxFile();
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
    this.positionService.findTrajetLastPosition(this._amiTrajet.id, {

      onGetPosition: (p: AppPosition) => {
        this.appPosition = p;
        this.urlToMaps = this.positionService.buildUrlToMaps(p);
      },
      onError: (e: Message) => console.log(e.msg)
    });


  }


}

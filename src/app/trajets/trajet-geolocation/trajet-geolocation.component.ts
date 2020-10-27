import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Trajet, TrajetState } from '../trajet.type';
import { AppPosition } from '../position.type';
import { Message } from 'src/app/common/message.type';
import { ToolsService } from 'src/app/common/tools.service';
import { PositionService } from 'src/app/geolocation/position.service';
import { Geoportail } from 'src/app/geoportail/geoportail.type';
import { AppStorageService } from '../storage.service';

@Component({
  selector: 'app-trajet-geolocation',
  templateUrl: './trajet-geolocation.component.html',
  styleUrls: ['./trajet-geolocation.component.scss']
})
export class TrajetGeolocationComponent implements OnInit {


  private _trajet: Trajet;
  @Input()
  set trajet(trajet: Trajet) {
    this._trajet = trajet;
    this.chercherLastPosition();
  }

  get trajet() {
    return this._trajet;
  }
  @Output() eventMessage = new EventEmitter<Message>();

  appPosition: AppPosition;
  private urlToMaps: string;
  // private urlToGeoportail: string;
  // private gpxfile: string;

  private geoportail: Geoportail;


  constructor(private positionService: PositionService, private localStorage: AppStorageService,
    private tools: ToolsService) { }

  ngOnInit(): void {
  }

  // uniquement si trajet termine
  private chercherLastPosition() {

    if (this._trajet && this._trajet.etat == TrajetState.ended) {

      this.positionService.findTrajetLastPosition(this._trajet.id, {
        onError: (e: Message) => this.eventMessage.emit(e),
        onGetPosition: (p: AppPosition) => {
          this.appPosition = p;
          if (this.appPosition) {
            this.urlToMaps = this.positionService.buildUrlToMaps(p);
            this.createOrUpdateGeoportail();
          } else {
            // pas de positions. S'assurer que c'est normal...
            this.positionService.verifierSiListPositionExisteInLocalStorage();
          }
        }
      });
    }
  }

  openMaps() {
    if (this.geoportail) {
      this.tools.openNewWindow(this.geoportail.url);
    } else if (this.urlToMaps) {
      this.tools.openNewWindow(this.urlToMaps);
    }
  }



  // uniquement si trajet termine
  createOrUpdateGeoportail() {

    // on ne fait rien si on a déjà l'info pour le meme trajet
    if (this.geoportail && this._trajet && this.geoportail.trajetid == this._trajet.id) {
      console.log("... createOrUpdateGeoportail() non nécessaire!");
      return;
    }

    this.geoportail = null;
    if (this._trajet) {
      this.positionService.createOrUpdateGeoportail(this._trajet.id, false, {

        onGetGeoportailInfo: (g: Geoportail) => {
          this.geoportail = g;
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
      })
    }
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

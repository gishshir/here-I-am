import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Trajet, TrajetState } from '../trajet.type';
import { AppPosition } from '../position.type';
import { Message } from 'src/app/common/message.type';
import { ToolsService } from 'src/app/common/tools.service';
import { PositionService } from 'src/app/geolocation/position.service';
import { Geoportail } from 'src/app/geoportail/geoportail.type';
import { NotificationService } from 'src/app/common/notification/notification.service';

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

  // TODO A terminer: utiliser dans tous les cas le component geolocation-component
  //appPosition: AppPosition;
  //private urlToMaps: string;
  // private urlToGeoportail: string;
  // private gpxfile: string;

  url: string;
  titre: string;
  private geoportail: Geoportail;


  constructor(private positionService: PositionService, private notificationService: NotificationService,
    private tools: ToolsService) { }

  ngOnInit(): void {
  }

  // uniquement si trajet termine
  private chercherLastPosition() {

    this.createOrUpdateGeoportail();
    if (this._trajet && this._trajet.etat == TrajetState.ended) {

      this.titre = "Dernière position";
      this.positionService.findTrajetLastPosition(this._trajet.id, {
        onError: (e: Message) => this.eventMessage.emit(e),
        onGetPosition: (p: AppPosition) => {
          //this.appPosition = p;
          if (p) {
            if (!this.url) {
              this.url = this.positionService.buildUrlToMaps(p);
            }
            this.notificationService.changeMaPosition(p);

          } else {
            // pas de positions. S'assurer que c'est normal...
            this.positionService.verifierSiListPositionExisteInLocalStorage();
          }
        }
      });
    } else {
      this.titre = "Position connue";
    }
  }

  // getUrl(): string {
  //   if (this.geoportail) {
  //     return this.geoportail.url;
  //   } else if (this.urlToMaps) {
  //     return this.urlToMaps;
  //   }
  // }
  // openMaps() {
  //   //let url = this.getUrl();
  //   if (this.url) {
  //     this.tools.openNewWindow(this.url);
  //   }
  // }



  // dans tous les cas
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
          this.url = this.geoportail.url;
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

    // if (this.appPosition) {
    //   return this.tools.formatDateJourMoisYY(this.appPosition.timestamp);
    // } else {
    //   return "";
    // }
    return "";
  }

  displayTime(): string {

    // if (this.appPosition) {
    //   return this.tools.formatTime(this.appPosition.timestamp);
    // } else {
    //   return "";
    // }
    return "";
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Trajet, TrajetState } from '../trajet.type';
import { AppPosition } from '../position.type';
import { Message } from 'src/app/common/message.type';
import { ToolsService } from 'src/app/common/tools.service';
import { PositionService } from 'src/app/geolocation/position.service';
import { Geoportail } from 'src/app/geoportail/geoportail.type';

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
  private urlToGeoportail: string;
  private gpxfile: string;


  constructor(private positionService: PositionService,
    private tools: ToolsService) { }

  ngOnInit(): void {
  }

  private chercherLastPosition() {
    if (this._trajet && this._trajet.etat == TrajetState.ended) {

      this.positionService.findTrajetLastPosition(this._trajet.id, {
        onError: (e: Message) => this.eventMessage.emit(e),
        onGetPosition: (p: AppPosition) => {
          this.appPosition = p;
          if (this.appPosition) {
            this.urlToMaps = this.positionService.buildUrlToMaps(p);
            this.createGpxFile();
          } else {
            // pas de positions. S'assurer que c'est normal...
            this.verifierSiListPositionExisteInLocalStorage();
          }
        }
      });
    }
  }

  openMaps() {
    if (this.urlToGeoportail) {
      this.tools.openNewWindow(this.urlToGeoportail);
    } else if (this.urlToMaps) {
      this.tools.openNewWindow(this.urlToMaps);
    }
  }


  /*
  * aucune position n'est enregistrée.
  * Verifier le local storage contient ces informations
  * Si c'est le cas elles sont envoyées au serveur et le local storage est nettoyé.
  * C'est une fonction de récupération dans le cas où l'envoi normal a échoué pour
  * un problème réseau.
  */
  verifierSiListPositionExisteInLocalStorage() {

    let listPositions = this.positionService.restoreListePositionsFromLocalStorage(this.trajet.id);
    if (listPositions && listPositions.length > 0) {

      // on les envoie sur le serveur distant
      this.positionService.insererListePositionAndClearLocalStorage(this.trajet.id, listPositions);
    }
  }

  createGpxFile() {
    this.gpxfile = null;
    if (this._trajet && this._trajet.etat == TrajetState.ended) {
      this.positionService.createGpxfile(this._trajet.id, false, {

        onGetGeoportailInfo: (g: Geoportail) => {
          this.gpxfile = g.gpxfile;
          this.urlToGeoportail = g.url;
        },
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

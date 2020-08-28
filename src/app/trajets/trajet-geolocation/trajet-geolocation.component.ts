import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Trajet, TrajetState } from '../trajet.type';
import { AppPosition } from '../position.type';
import { Message } from 'src/app/common/message.type';
import { ToolsService } from 'src/app/common/tools.service';
import { PositionService } from 'src/app/geolocation/position.service';

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
  urlToMaps: string;
  gpxfile: string;


  constructor(private positionService: PositionService,
    private tools: ToolsService) { }

  ngOnInit(): void {
  }

  private chercherLastPosition() {
    if (this._trajet && this._trajet.etat == TrajetState.ended) {

      this.positionService.findTrajetPosition(this._trajet.id, {
        onError: (e: Message) => this.eventMessage.emit(e),
        onGetPosition: (p: AppPosition) => {
          this.appPosition = p;
          this.urlToMaps = this.positionService.buildUrlToMaps(p);
          this.createGpxFile();
        }
      });
    }
  }

  openMaps() {
    this.tools.openNewWindow(this.urlToMaps);
  }

  createGpxFile() {
    this.gpxfile = null;
    if (this._trajet && this._trajet.etat == TrajetState.ended) {
      this.positionService.createGpxfile(this._trajet.id, {

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

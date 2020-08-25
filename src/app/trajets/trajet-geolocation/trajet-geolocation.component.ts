import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Trajet, TrajetState } from '../trajet.type';
import { AppPosition } from '../position.type';
import { GeolocationService } from 'src/app/geolocation/geolocation.service';
import { Message } from 'src/app/common/message.type';
import { ToolsService } from 'src/app/common/tools.service';

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


  constructor(private geolocationService: GeolocationService, private tools: ToolsService) { }

  ngOnInit(): void {
  }

  private chercherLastPosition() {
    if (this._trajet && this._trajet.etat == TrajetState.ended) {

      this.geolocationService.findTrajetPosition(this._trajet.id, {
        onError: (e: Message) => this.eventMessage.emit(e),
        onGetPosition: (p: AppPosition) => {
          this.appPosition = p;
          this.urlToMaps = this.geolocationService.buildUrlToMaps(p);
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
      this.geolocationService.createGpxfile(this._trajet.id, {

        onResponse: (f: string) => this.gpxfile = f,
        onError: (e: Message) => console.log(e.msg)
      });
    }
  }

  download() {
    this.geolocationService.downloadGpxfile(this.gpxfile, {
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

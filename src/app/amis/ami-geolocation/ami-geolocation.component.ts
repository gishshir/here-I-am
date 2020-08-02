import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TrajetService } from 'src/app/trajets/trajet.service';
import { Ami } from '../ami.type';
import { Trajet, TrajetState } from 'src/app/trajets/trajet.type';
import { Message } from 'src/app/common/message.type';
import { AppPosition } from 'src/app/trajets/position.type';
import { NotificationService } from 'src/app/common/notification/notification.service';

@Component({
  selector: 'app-ami-geolocation',
  templateUrl: './ami-geolocation.component.html',
  styleUrls: ['./ami-geolocation.component.scss']
})
export class AmiGeolocationComponent implements OnInit {

  @Input()
  set amiTrajet(trajet: Trajet) {
    this._amiTrajet = trajet;
    this.changeAmiTrajet();
  }

  @Output() eventMessage = new EventEmitter<Message>();

  position: AppPosition;
  urlToMaps: string;

  private _amiTrajet: Trajet;

  // token sur le timer
  private timerid: number = -1;

  constructor(private trajetService: TrajetService, private notificationService: NotificationService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.stopTimer();
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

      if (this.position == undefined) {
        this.findAmiTrajetPosition();
      }
      switch (this._amiTrajet.etat) {

        case TrajetState.started: this.startTimer(); break;

        case TrajetState.pausing:
        case TrajetState.ended: this.stopTimer();
      }

    }
    else {
      this.position = null;
    }

  }

  private buildUrlToMaps(): void {

    if (this.position) {
      let latitude = Number(this.position.latitude);
      let longitude = Number(this.position.longitude);

      this.urlToMaps = this.trajetService.buildUrlToMaps(latitude, longitude);
    }
  }

  private findAmiTrajetPosition(): void {

    console.log("findAmiTrajetPosition()");
    this.trajetService.findTrajetPosition(this._amiTrajet.id, {

      onGetPosition: (p: AppPosition) => {
        this.position = p;
        this.buildUrlToMaps();
      },
      onError: (e: Message) => console.log(e.msg)
    });


  }


}

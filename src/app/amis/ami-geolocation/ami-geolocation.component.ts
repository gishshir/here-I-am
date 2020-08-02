import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TrajetService } from 'src/app/trajets/trajet.service';
import { Ami } from '../ami.type';
import { Trajet, TrajetState } from 'src/app/trajets/trajet.type';
import { Message } from 'src/app/common/message.type';
import { AppPosition } from 'src/app/trajets/position.type';

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

  private _amiTrajet: Trajet;

  // token sur le timer
  private timerid: number = -1;

  constructor(private trajetService: TrajetService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  // demarre timer si necessaire
  private startTimer() {
    if (this.timerid == -1) {
      console.log("startTimer()");

      // rafraichir trajet toutes les 10s 
      // jusqu'à arret du trajet
      this.timerid = window.setInterval(() => {

        this.findAmiTrajetPosition();
      }, 10000);

    }
  }
  private stopTimer() {
    console.log("stopTimer()");
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

  private findAmiTrajetPosition(): void {

    console.log("findAmiTrajetPosition()");
    this.trajetService.findTrajetPosition(this._amiTrajet.id, {

      onGetPosition: (p: AppPosition) => this.position = p,
      onError: (e: Message) => console.log(e.msg)
    });


  }


}

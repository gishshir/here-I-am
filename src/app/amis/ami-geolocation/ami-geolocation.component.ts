import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TrajetService } from 'src/app/trajets/trajet.service';
import { Ami } from '../ami.type';
import { Trajet } from 'src/app/trajets/trajet.type';
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
    this.findAmiTrajetPosition();
  }

  @Output() eventMessage = new EventEmitter<Message>();

  private _amiTrajet: Trajet;
  position: AppPosition;

  constructor(private trajetService: TrajetService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private startTimer() {
    console.log("startTimer()");
    this.findAmiTrajetPosition();
  }
  private stopTimer() {
    console.log("stopTimer()");
  }

  private findAmiTrajetPosition(): void {

    console.log("findAmiTrajetPosition()");
    if (this._amiTrajet) {
      this.trajetService.findTrajetPosition(this._amiTrajet.id, {

        onGetPosition: (p: AppPosition) => this.position = p,
        onError: (e: Message) => console.log(e.msg)
      });

    } else {
      this.position = null;
    }
  }


}

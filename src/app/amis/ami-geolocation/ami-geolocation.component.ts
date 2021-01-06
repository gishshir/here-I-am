import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Trajet, TrajetState } from 'src/app/trajets/trajet.type';
import { Message } from 'src/app/common/message.type';
import { AppPosition } from 'src/app/trajets/position.type';
import { NotificationService } from 'src/app/common/notification/notification.service';
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

  get amiTrajet(): Trajet {
    return this._amiTrajet;
  }

  //geoportail: Geoportail;
  titre: string = "Position de mon ami(e)";

  private _amiTrajet: Trajet;

  // token sur le timer
  private timerid: number = -1;

  constructor(private positionService: PositionService, private notificationService: NotificationService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.stopTimer();
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

      this.findAmiTrajetPosition();

      // depuis 27/10 : acces à geoportail dans tous les cas
      //this.createOrUpdateGeoportail();
      switch (this._amiTrajet.etat) {

        case TrajetState.started: this.startTimer(); break;

        case TrajetState.pausing:
        case TrajetState.ended: {
          this.stopTimer();
          this.titre = "Dernière position connue";
        }
      }

    }


  }
  private findAmiTrajetPosition(): void {

    console.log("findAmiTrajetPosition()");
    this.notificationService.useNetwork(NetworkState.pending);
    this.positionService.findAmiTrajetLastPosition(this._amiTrajet.id, {

      onGetPosition: (p: AppPosition) => {
        this.notificationService.useNetwork(NetworkState.success);
        this.notificationService.changeUnePosition(p);

      },
      onError: (e: Message) => {
        console.log(e.msg);
        this.notificationService.useNetwork(NetworkState.error);
      }
    });


  }


}

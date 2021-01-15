import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Trajet, TrajetState } from '../trajet.type';
import { AppPosition } from '../position.type';
import { Message } from 'src/app/common/message.type';
import { PositionService } from 'src/app/geolocation/position.service';
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

  titre: string;


  constructor(private positionService: PositionService, private notificationService: NotificationService) { }

  ngOnInit(): void {
  }

  // dans tous les cas
  private chercherLastPosition() {

    console.log("chercherLastPosition()");

    if (this._trajet) {

      console.log("on cherche dernière position en BDD!");
      this.titre = this._trajet.etat == TrajetState.ended ? "Dernière position" : "Position connue:";
      this.positionService.findTrajetLastPosition(this._trajet.id, {
        onError: (e: Message) => this.eventMessage.emit(e),
        onGetPosition: (p: AppPosition) => {
          if (p) {
            this.notificationService.changeUnePosition(p);

          } else {
            // pas de positions. S'assurer que c'est normal...
            this.positionService.verifierSiListPositionExisteInLocalStorage();
          }
        }
      });
    }
  }

}

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Trajet, TrajetState } from '../trajet.type';
import { ToolsService } from 'src/app/common/tools.service';
import { TrajetService } from '../trajet.service';
import { Message } from '../../common/message.type';
import { NotificationService } from 'src/app/common/notification/notification.service';
import { NetworkState } from 'src/app/common/common.service';


/**
 * composant de base à inclure dans des composants parents
 * Suivi de l'etat d'un trajet avec timer
 */
@Component({
  selector: 'app-trajet-common',
  templateUrl: './trajet-common.component.html',
  styleUrls: ['./trajet-common.component.scss']
})
export class TrajetCommonComponent implements OnInit, OnDestroy {

  @Input() ami: boolean;
  @Input() trajet: Trajet;
  @Input() timerOn: boolean = false;

  // lancement d'un evenement de changement etat
  @Output() trajetChangeEtatEvent = new EventEmitter<Trajet>();


  // token sur le timer
  private timerid: number = -1;

  constructor(private toolsService: ToolsService, private trajetService: TrajetService,
    private notificationService: NotificationService) {
  }


  private refreshTrajet() {

    if (this.trajetService) {
      this.trajetService.findTrajetById(this.trajet.id, this.ami, {

        onGetTrajet: (t: Trajet) => {

          if (t.etat == TrajetState.ended) {
            this.stopTimer();
          }
          if (this.trajet.etat != t.etat) {
            this.trajet = t;
            this.trajetChangeEtatEvent.emit(t);
          }
        },
        onError: (e: Message) => console.log(e.msg)
      });
    }
  }

  // rafraichir trajet toutes les 30s 
  // jusqu'à arret du trajet
  private startTimer() {

    console.log("start timer");
    this.notificationService.useNetwork(NetworkState.started);
    this.timerid = window.setInterval(() => {

      this.refreshTrajet();
    }, 30000);
  }

  private stopTimer() {

    if (this.timerid >= 0) {
      console.log("stop timer");
      this.notificationService.useNetwork(NetworkState.stopped);
      clearInterval(this.timerid);
      this.timerid = -1;
    }
  }

  getStartDate(): string {

    return this.toolsService.formatDateAndTime(this.trajet.starttime);
  }

  getEndDate(): string {

    if (this.trajet.endtime < 0) {
      return "";
    }
    return this.toolsService.formatDateAndTime(this.trajet.endtime);
  }



  ngOnInit(): void {
    console.log("trajet en cours: " + this.trajet.id);
    if (this.timerOn) {
      this.startTimer();
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

}

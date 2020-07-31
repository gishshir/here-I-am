import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Trajet, TrajetState } from '../trajet.type';
import { ToolsService } from 'src/app/common/tools.service';
import { TrajetService } from '../trajet.service';
import { Message } from '../../common/message.type';

@Component({
  selector: 'app-trajet-common',
  templateUrl: './trajet-common.component.html',
  styleUrls: ['./trajet-common.component.scss']
})
export class TrajetCommonComponent implements OnInit {

  @Input() trajet: Trajet;
  @Input() timerOn: boolean = false;
  @Output() trajetChangeEtatEvent = new EventEmitter<Trajet>();


  // token sur le timer
  private timerid: number = -1;

  constructor(private toolsService: ToolsService, private trajetService: TrajetService) {
  }


  private refreshTrajet() {

    if (this.trajetService) {
      this.trajetService.findTrajetById(this.trajet.id, {

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

  // rafraichir trajet toutes les 5s 
  // jusqu'à arret du trajet
  private startTimer() {

    console.log("start timer");
    this.timerid = window.setInterval(() => {

      this.refreshTrajet();
    }, 5000);
  }

  private stopTimer() {
    console.log("stop timer");
    if (this.timerid >= 0) {
      clearInterval(this.timerid
      );
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
    if (this.timerOn) {
      this.startTimer();
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

}

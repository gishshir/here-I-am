import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ToolsService } from 'src/app/common/tools.service';
import { TrajetState } from '../trajet-etat.enum';
import { Trajet } from '../trajet.type';

@Component({
  selector: 'app-trajet-duree',
  template: '<div *ngIf="duree" style="background-color: {{color}}; margin: 30px; padding: 20px;">durée: {{duree}}</div>'
})
export class TrajetDureeComponent implements OnInit {


  duree: string;
  color: string;

  private _trajetEnCours: Trajet;

  @Input()
  set trajetEnCours(trajet: Trajet) {
    if (trajet) {
      this._trajetEnCours = trajet;
      this.calculDuree();
    }
  }

  message: string = "";

  constructor(private toolsService: ToolsService) {
  }

  private intervalId: number = -1;
  private calculDuree(): void {

    this.definirColor();
    this.stopTimer();
    if (this._trajetEnCours.etat === TrajetState.ended) {
      this.duree = this.toolsService.formatDuree(this._trajetEnCours.starttime, this._trajetEnCours.endtime);
    } else {
      // décompte du temps écoulé depuis startDate jusqu'à maintenant
      this.startTimer();

    }
  }

  private definirColor(): void {

    let color: string;
    switch (this._trajetEnCours.etat) {
      case TrajetState.ended: color = 'brown'; break;
      case TrajetState.pausing: color = 'yellow'; break;
      case TrajetState.started: color = 'lightgreen'; break;
      default: color = 'grey';
    }
    this.color = color;
  }
  ngOnDestroy() { this.stopTimer(); }
  private stopTimer() {
    this.duree = "";
    if (this.intervalId >= 0) {
      clearInterval(this.intervalId);
    }
  }
  private startTimer(): void {

    this.intervalId = window.setInterval(() => {

      this.duree = this.toolsService.formatDureeFromNow(this._trajetEnCours.starttime);
    }, 1000);
  }

  ngOnInit(): void {

  }

}


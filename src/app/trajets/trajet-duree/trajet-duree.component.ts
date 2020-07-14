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

  @Input()
  set trajetEnCours(trajet: Trajet) {
    if (trajet) {

      this.analyseChangement(trajet);
    }
  }

  message: string = "";



  //private _trajetEnCours: Trajet;

  private _starttime: number = -1;
  private _endtime: number = -1;
  private _etat: TrajetState = null;


  constructor(private toolsService: ToolsService) {
  }

  private intervalId: number = -1;

  // si changement starttime --> calculDuree
  // si changement etat 
  private analyseChangement(trajet: Trajet) {

    console.log("analyseChangement()");
    let oldstarttime = this._starttime;
    let oldetat = this._etat;

    this._starttime = trajet.starttime;
    this._etat = trajet.etat;
    this._endtime = trajet.endtime;

    // changement de trajet
    if (oldstarttime != this._starttime) {

      this.stopTimer();
      this.definirColor();

      if (this._etat === TrajetState.ended) {
        this.calculDureeEtatEnded();
      } else {
        // décompte du temps écoulé depuis startDate jusqu'à maintenant
        this.startTimer();

      }

      // changement etat d'un meme trajet
    } else if (oldetat != this._etat) {

      this.definirColor();
      if (this._etat == TrajetState.ended) {
        this.stopTimer();
        this.calculDureeEtatEnded();
      }

    }

  }

  private calculDureeEtatEnded() {
    this.duree = this.toolsService.formatDuree(this._starttime, this._endtime);
  }



  private definirColor(): void {
    console.log("definir color");
    let color: string;
    switch (this._etat) {
      case TrajetState.ended: color = 'brown'; break;
      case TrajetState.pausing: color = 'yellow'; break;
      case TrajetState.started: color = 'lightgreen'; break;
      default: color = 'grey';
    }
    this.color = color;
  }
  ngOnDestroy() { this.stopTimer(); }
  private stopTimer() {
    console.log("stop timer");
    this.duree = "";
    if (this.intervalId >= 0) {
      clearInterval(this.intervalId);
    }
  }
  private startTimer(): void {

    console.log("start timer");
    this.intervalId = window.setInterval(() => {

      this.duree = this.toolsService.formatDureeFromNow(this._starttime);
    }, 1000);
  }

  ngOnInit(): void {

  }

}



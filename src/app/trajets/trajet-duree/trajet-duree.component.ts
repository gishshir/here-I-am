import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ToolsService, DureeDecoupee } from 'src/app/common/tools.service';
import { Trajet, TrajetState } from '../trajet.type';

@Component({
  selector: 'app-trajet-duree',
  templateUrl: './trajet-duree.component.html',
  styleUrls: ['./trajet-duree.component.css']
})
export class TrajetDureeComponent implements OnInit {


  dureeExtra: string;
  dureeHMS: string;
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
    let dureeDecoupee = this.toolsService.formatDuree(this._starttime, this._endtime);
    this.dureeExtra = this.formatDureeExtra(dureeDecoupee);
    this.dureeHMS = this.formatHeureMinuteSeconde(dureeDecoupee);
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
    this.dureeExtra = null;
    this.dureeHMS = "";
    if (this.intervalId >= 0) {
      clearInterval(this.intervalId);
    }
  }
  private startTimer(): void {

    console.log("start timer");
    this.intervalId = window.setInterval(() => {

      let dureeDecoupee = this.toolsService.formatDureeFromNow(this._starttime);
      this.dureeExtra = this.formatDureeExtra(dureeDecoupee);
      this.dureeHMS = this.formatHeureMinuteSeconde(dureeDecoupee);
    }, 1000);
  }

  // formatage HH:MM:SS
  private formatHeureMinuteSeconde(dureeDecoupee: DureeDecoupee): string {

    return dureeDecoupee.heure + ":" + dureeDecoupee.minute + ":" + dureeDecoupee.seconde;
  }
  // afficher jour/semaine/mois/annees si necessaire
  private formatDureeExtra(dureeDecoupee: DureeDecoupee): string {

    if (dureeDecoupee.jour > 0 || dureeDecoupee.semaine > 0 || dureeDecoupee.mois > 0 || dureeDecoupee.annee > 0) {

      var eventDurationArray: string[] = [];

      if (dureeDecoupee.annee > 0) {
        eventDurationArray.push(dureeDecoupee.annee + ' années');
      }
      if (dureeDecoupee.mois > 0) {
        eventDurationArray.push(dureeDecoupee.mois + ' mois');
      }
      if (dureeDecoupee.semaine > 0) {
        eventDurationArray.push(dureeDecoupee.semaine + ' semaines');
      }
      if (dureeDecoupee.jour > 0) {
        eventDurationArray.push(dureeDecoupee.jour + ' jours');
      }
      return eventDurationArray.join('  ');

    } else return null;
  }

  ngOnInit(): void {

  }

}



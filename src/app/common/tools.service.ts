import { Injectable } from '@angular/core';

import * as moment from 'moment';
import 'moment/locale/fr';



@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor() { }

  private _formatDate(timestamp: number, format: string): string {
    let date = new Date(timestamp * 1000);
    return moment(date).format(format);
  }

  formatDate(timestamp: number): string {

    return this._formatDate(timestamp, 'D MMM YYYY');
  }
  formatDateJourMoisYY(timestamp: number): string {

    return this._formatDate(timestamp, 'D MMM YY');
  }
  formatDateAndTime(timestamp: number): string {

    return this._formatDate(timestamp, 'D MMM YYYY HH:mm');
  }
  formatTime(timestamp: number): string {
    return this._formatDate(timestamp, 'HH:mm:ss');
  }

  formatDuree(tsStart: number, tsEnd: number): DureeDecoupee {
    let diffs: number = (tsEnd - tsStart);
    let diffMin: number = diffs / (60);

    return this.decoupage(diffMin);
  }

  formatDureeFromNow(tsStart: number): DureeDecoupee {

    return this.formatDuree(tsStart, new Date().getTime() / 1000);
  }

  // decoupage en un objet DureeDecoupee
  private decoupage(durationMin: number): DureeDecoupee {

    let dureeDecoupee = new DureeDecoupee();
    var eventMDuration = moment.duration(durationMin, "minute");

    dureeDecoupee.annee = eventMDuration.years();
    if (eventMDuration.years() > 0) {
      eventMDuration.subtract(eventMDuration.years(), 'years')
    }

    dureeDecoupee.mois = eventMDuration.months();
    if (eventMDuration.months() > 0) {
      eventMDuration.subtract(eventMDuration.months(), 'months')
    }

    dureeDecoupee.semaine = eventMDuration.weeks();
    if (eventMDuration.weeks() > 0) {
      eventMDuration.subtract(eventMDuration.weeks(), 'weeks')
    }

    dureeDecoupee.jour = eventMDuration.days();
    if (eventMDuration.days() > 0) {
      eventMDuration.subtract(eventMDuration.days(), 'days')
    }

    dureeDecoupee.heure = eventMDuration.hours();
    if (eventMDuration.hours() > 0) {
      eventMDuration.subtract(eventMDuration.hours(), 'hours')
    }

    dureeDecoupee.minute = eventMDuration.minutes();
    if (eventMDuration.minutes() > 0) {
      eventMDuration.subtract(eventMDuration.minutes(), 'minutes');
    }

    dureeDecoupee.seconde = eventMDuration.seconds();

    return dureeDecoupee;
  }


  private momentHumanize(durationMin: number): string {

    let dureeDecoupee = this.decoupage(durationMin);

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
    if (dureeDecoupee.heure > 0) {
      eventDurationArray.push(dureeDecoupee.heure + ' heures');
    }
    if (dureeDecoupee.minute > 0) {
      eventDurationArray.push(dureeDecoupee.minute + ' minutes');
    }
    if (dureeDecoupee.seconde > 0) {
      eventDurationArray.push(dureeDecoupee.seconde + ' secondes');
    }
    return eventDurationArray.length === 1 ? eventDurationArray[0] :
      eventDurationArray.join('  ')
  }
}

export class DureeDecoupee {

  seconde: number;
  minute: number;
  heure: number;
  jour: number;
  semaine: number;
  mois: number;
  annee: number;
}

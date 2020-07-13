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
  formatDateAndTime(timestamp: number): string {

    return this._formatDate(timestamp, 'D MMM YYYY hh:mm');
  }

  formatDuree(tsStart: number, tsEnd: number): string {
    let diffs: number = (tsEnd - tsStart);
    let diffMin: number = diffs / (60);

    return this.momentHumanize(diffMin);
  }

  formatDureeFromNow(tsStart: number): string {

    return this.formatDuree(tsStart, new Date().getTime() / 1000);
  }

  private momentHumanize(durationMin: number): string {
    var eventMDuration = moment.duration(durationMin, "minute");
    var eventDurationArray: string[] = [];
    if (eventMDuration.years() > 0) {
      eventDurationArray.push(eventMDuration.years() + ' années');
      eventMDuration.subtract(eventMDuration.years(), 'years')
    }
    if (eventMDuration.months() > 0) {
      eventDurationArray.push(eventMDuration.months() + ' mois');
      eventMDuration.subtract(eventMDuration.months(), 'months')
    }
    if (eventMDuration.weeks() > 0) {
      eventDurationArray.push(eventMDuration.weeks() + ' semaines');
      eventMDuration.subtract(eventMDuration.weeks(), 'weeks')
    }
    if (eventMDuration.days() > 0) {
      eventDurationArray.push(eventMDuration.days() + ' jours');
      eventMDuration.subtract(eventMDuration.days(), 'days')
    }
    if (eventMDuration.hours() > 0) {
      eventDurationArray.push(eventMDuration.hours() + ' heures');
      eventMDuration.subtract(eventMDuration.hours(), 'hours')
    }
    if (eventMDuration.minutes() > 0) {
      eventDurationArray.push(eventMDuration.minutes() + ' minutes');
      eventMDuration.subtract(eventMDuration.minutes(), 'minutes');
    }
    if (eventMDuration.seconds() > 0) {
      eventDurationArray.push(eventMDuration.seconds() + ' secondes');
    }
    return eventDurationArray.length === 1 ? eventDurationArray[0] :
      eventDurationArray.join('  ')
  }
}

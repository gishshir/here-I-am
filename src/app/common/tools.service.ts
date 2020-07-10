import { Injectable } from '@angular/core';

import * as moment from 'moment';
import 'moment/locale/fr';

export const PHP_API_SERVER = "http://whereIAm.localhost";

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor() { }

  private _formatDate (timestamp: number, format: string) :string {
    let date = new Date(timestamp);
    return moment(date).format(format);
  }

  formatDate (timestamp: number) :string {
    
    let date = new Date(timestamp);
    return this._formatDate(timestamp, 'D MMM YYYY');
  }
  formatDateAndTime (timestamp: number) :string {
    
    let date = new Date(timestamp);
    return this._formatDate(timestamp, 'D MMM YYYY hh:mm');
  }

  formatDuree (tsStart: number, tsEnd : number):string {
    let diffms:number = (tsEnd - tsStart);
    let diffMin:number = diffms/(1000*60);
    
    return this.momentHumanize(diffMin);
  }

  formatDureeFromNow (tsStart: number) : string {

    return this.formatDuree (tsStart, new Date().getTime());
  }

  private momentHumanize(duration: number) :string{
    var eventMDuration = moment.duration(duration, "minute");
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
    if (eventMDuration.seconds() > 0){
      eventDurationArray.push(eventMDuration.seconds() + ' secondes');
    }
    return eventDurationArray.length === 1 ? eventDurationArray[0] : 
    eventDurationArray.join('  ')
}
}

import { Injectable } from '@angular/core';
import { LoggerService } from '../logger.service';
import { TRAJETS }  from './mock-trajets';
import { TrajetState } from './trajet-etat.enum';
import { Trajet } from './trajet.type';

@Injectable({
  providedIn: 'root'
})
export class TrajetService {

  constructor(private logger:LoggerService) { }

  getTrajets (userid: number)  {

    return TRAJETS;
  }

  changerStatus (trajetId:number, newState: TrajetState): Trajet {

    let trajet:Trajet = this.getTrajetById (trajetId);
    if (trajet != null) {
      trajet.etat = newState;

      if (trajet.etat === TrajetState.ended) {
        trajet.endDate = new Date().getTime();
      }
      return trajet;
    }

    return trajet;

  }

  getTrajetById (trajetid: number): Trajet {

    let trajet = null;

    return TRAJETS.find (t => t.id == trajetid);

  }
}

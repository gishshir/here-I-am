import { Injectable } from '@angular/core';
import { LoggerService } from '../logger.service';
import { TRAJETS }  from './mock-trajets';
import { TrajetState } from './trajet-etat.enum';
import { Trajet } from './trajet.type';
import { TrajetMeans } from './trajet-means.enum';

@Injectable({
  providedIn: 'root'
})
export class TrajetService {

  constructor(private logger:LoggerService) { }

  trajets: Trajet[] = TRAJETS;

  getTrajets (userid: number)  {

    return this.trajets;
  }

  chercherTrajetEnCours () {

    let trajet:Trajet = this.trajets.find (t => 

      t.etat !== TrajetState.ended
    );

    return trajet;
  }

  chercherDernierTrajet () : Trajet {

    if (this.trajets && this.trajets.length > 0) {
      return this.trajets[this.trajets.length - 1];
    } else return null;
  }

  demarrerNouveauTrajet (userId: number, mean: TrajetMeans) : Trajet {

    let trajet : Trajet =  new Trajet();
    trajet.id = this.trajets.length + 1;
    trajet.startDate = new Date().getTime();
    trajet.etat = TrajetState.started;
    trajet.mean = mean;

    this.trajets.push (trajet);

    return trajet;
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

    return this.trajets.find (t => t.id == trajetid);

  }
}

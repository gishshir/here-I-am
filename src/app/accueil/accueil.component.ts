import { Component, OnInit, Input } from '@angular/core';
import { Trajet } from '../trajets/trajet.type';
import { TrajetService } from '../trajets/trajet.service';
import { TrajetState } from '../trajets/trajet-etat.enum';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {


  dernierTrajet: Trajet;

  constructor(private trajetService: TrajetService) {

    this.refreshDernierTrajet();
  }

  onChangeState(trajet: Trajet): void {

    this.dernierTrajet = trajet;
  }

  refreshDernierTrajet(): void {

    this.dernierTrajet = null;
    this.trajetService.chercherDernierTrajet({

      onGetTrajet: t => {
        this.dernierTrajet = t;
      },
      onError: m => console.log(m)

    });

  }

  ngOnInit(): void {
  }

  showCardNouveauTrajet(): boolean {

    return this.dernierTrajet == null || this.dernierTrajet.etat === TrajetState.ended;
  }



}

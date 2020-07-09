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

    this.dernierTrajet = trajetService.chercherDernierTrajet();
   }

  ngOnInit(): void {
  }

  showCardNouveauTrajet () : boolean {

    return this.dernierTrajet == null || this.dernierTrajet.etat === TrajetState.ended;
  }

  onChangeState (trajetState: TrajetState) : void {
    
    this.dernierTrajet = this.trajetService.chercherDernierTrajet();
  }

}

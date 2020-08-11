import { Component, OnInit, Input } from '@angular/core';
import { Trajet, TrajetState } from '../trajets/trajet.type';
import { TrajetService } from '../trajets/trajet.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { NotificationService } from '../common/notification/notification.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {


  dernierTrajet: Trajet;
  response: Message;

  constructor(private trajetService: TrajetService, private notificationService: NotificationService) {

    this.refreshDernierTrajet();
  }

  onChangeState(trajet: Trajet): void {

    this.dernierTrajet.etat = trajet.etat;
  }
  // reception d'un evenement de message
  onMessage(response: Message) {
    this.response = response;
  }

  refreshDernierTrajet(): void {

    this.dernierTrajet = null;
    this.trajetService.chercherDernierTrajet({

      onGetTrajet: (t: Trajet) => {
        if (t && t.id) {
          this.dernierTrajet = t;
          this.notificationService.changeMonTrajet(t);

          // s'inscrit aux evenements de changement de trajet ou etat de trajet
          this.notificationService.monTrajet$.subscribe((t: Trajet) => this.onChangeState(t));

        }
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

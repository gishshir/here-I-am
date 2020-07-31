import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Trajet, TrajetState } from 'src/app/trajets/trajet.type';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { TrajetService } from 'src/app/trajets/trajet.service';
import { Ami } from '../ami.type';

@Component({
  selector: 'app-ami-trajet',
  templateUrl: './ami-trajet.component.html',
  styleUrls: ['./ami-trajet.component.scss']
})
export class AmiTrajetComponent implements OnInit {

  @Input()
  set amiDetail(ami: Ami) {
    this.findAmiDernierTrajet(ami);
  }
  @Output() eventMessage = new EventEmitter<Message>();

  amiTrajet: Trajet;

  constructor(private trajetService: TrajetService) {
  }

  // event de changement d'etat du trajet
  onTrajetChangeEtatEvent(trajet: Trajet) {

    this.amiTrajet = trajet;
  }

  getDescriptionTrajet(): string {

    let description = null;
    if (this.amiTrajet) {
      switch (this.amiTrajet.etat) {

        case TrajetState.started: description = "Mon ami(e) est en chemin..."; break;
        case TrajetState.pausing: description = "Mon ami(e) s'est arrêté..."; break;
        case TrajetState.ended: description = "Mon ami(e) est arrivé à destination."; break;

      }
    }

    return description;

  }

  findAmiDernierTrajet(ami: Ami): void {

    this.amiTrajet = null;
    this.trajetService.chercherAmiDernierTrajet(ami.idrelation, {

      onGetTrajet: t => {
        if (t && t.id) {
          this.amiTrajet = t;
        }
      },
      onError: m => console.log(m)

    });

  }


  ngOnInit(): void {
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { TrajetMeans } from '../trajet.type';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { TrajetService } from '../trajet.service';

@Component({
  selector: 'app-trajet-means-icon',
  templateUrl: './trajet-means-icon.component.html',
  styleUrls: ['./trajet-means-icon.component.css'],
  animations: [
    trigger('arret-marche', [

      state('arret', style({
        position: 'relative',
        left: '0px'
      })),

      state('marche', style({
        position: 'relative',
        left: '50px'
      })),

      transition('* => marche', [
        animate('2s')
      ]),

      transition('marche => arret', [
        animate('0.5s')
      ]),

    ])
  ]
})
export class TrajetMeansIconComponent implements OnInit {

  @Input() trajetMean: TrajetMeans;
  @Input() taille: number = 24;
  @Input() isArret: boolean = true;

  constructor(private trajetService: TrajetService) { }

  ngOnInit(): void {
  }

  getDescription(): string {
    return TrajetMeansIconComponent.displayName(this.trajetMean);
  }

  getCurrentIconName(): string {
    return this.trajetService.getIconName(this.trajetMean);
  }

  static displayName(mean: TrajetMeans): string {

    let description: string = "";
    switch (mean) {

      case TrajetMeans.avion: description = "Trajet en avion."; break;
      case TrajetMeans.bateau: description = "Trajet en bateau."; break;
      case TrajetMeans.bus: description = "Trajet en bus."; break;
      case TrajetMeans.moto: description = "Trajet à moto."; break;
      case TrajetMeans.pied: description = "Trajet à pied."; break;
      case TrajetMeans.train: description = "Trajet en train."; break;
      case TrajetMeans.velo: description = "Trajet en vélo."; break;
      case TrajetMeans.voiture: description = "Trajet en voiture."; break;
    }

    return description;
  }

}

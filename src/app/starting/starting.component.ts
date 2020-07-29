import { Component, OnInit, ViewChild } from '@angular/core';
import { TrajetMeansIconComponent } from '../trajets/trajet-means-icon/trajet-means-icon.component';
import { Trajet, TrajetState, TrajetMeans } from '../trajets/trajet.type';
import { TrajetService } from '../trajets/trajet.service';
import { Message } from '../common/message.type';
import { AmiService } from '../amis/ami.service';



@Component({
  selector: 'app-starting',
  templateUrl: './starting.component.html',
  styleUrls: ['./starting.component.css']
})
export class StartingComponent implements OnInit {


  trajetMeansEnum: TrajetMeans[] = [];
  selectedMean: TrajetMeans;
  nouveauTrajet: Trajet;
  response: Message;

  constructor(private trajetService: TrajetService, private amiService: AmiService) {
    let trajetMeansKeys: string[] = Object.keys(TrajetMeans);
    trajetMeansKeys.forEach(v => {

      let m: TrajetMeans = <TrajetMeans>TrajetMeans[v];
      if (m) {
        this.trajetMeansEnum.push(m);
      }
    });

  }

  // a l'ecoute des event message
  onMessage(m: Message) {
    this.response = m;
  }

  onChangeMean(mean: TrajetMeans) {
    this.selectedMean = mean;
    // todo mettre à jour le moyen de trajet si trajet démarré...
    if (this.nouveauTrajet) {
      this.trajetService.changerMeanTrajet(this.nouveauTrajet.id, mean, {

        onGetTrajet: (t: Trajet) => {
          this.nouveauTrajet.mean = t.mean;
          this.response = { msg: "moyen de transport '" + t.mean + "' pris en compte!", error: false }
        },
        onError: (error: Message) => this.response = error

      });
    }
  }


  diplaySelectedMeanDescription(): string {

    if (this.selectedMean) {
      return TrajetMeansIconComponent.displayName(this.selectedMean);
    } else {
      return "";
    }
  }



  arreterTrajet(): void {

    this.trajetService.changerStatusTrajet(this.nouveauTrajet.id, TrajetState.ended, {

      onGetTrajet: (t: Trajet) => this.nouveauTrajet = t,
      onError: (error: Message) => this.response = error
    });

  }
  demarrerNouveauTrajet(): void {

    this.trajetService.demarrerNouveauTrajet(this.selectedMean, {

      onGetTrajet: t => this.nouveauTrajet = t,
      onError: e => this.response = e
    });
  }



  ngOnInit(): void {
  }

}

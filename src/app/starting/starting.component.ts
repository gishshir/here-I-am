import { Component, OnInit, ViewChild } from '@angular/core';
import { TrajetMeans } from '../trajets/trajet-means.enum';
import { TrajetMeansIconComponent } from '../trajets/trajet-means-icon/trajet-means-icon.component';
import { Trajet } from '../trajets/trajet.type';
import { TrajetService } from '../trajets/trajet.service';
import { TrajetState } from '../trajets/trajet-etat.enum';
import { TrajetDureeComponent } from '../trajets/trajet-duree/trajet-duree.component';



@Component({
  selector: 'app-starting',
  templateUrl: './starting.component.html',
  styleUrls: ['./starting.component.css']
})
export class StartingComponent implements OnInit {

  
  trajetMeansEnum : TrajetMeans[] = [];
  selectedMean: TrajetMeans;
  nouveauTrajet: Trajet;

  diplaySelectedMeanDescription ():string {

    if (this.selectedMean) {
      return TrajetMeansIconComponent.displayName(this.selectedMean);
    } else {
      return "";
    }
  }

 
  arreterTrajet () : void {

    this.nouveauTrajet = this.trajetService.changerStatus (this.nouveauTrajet.id, TrajetState.ended);
    
  }
  demarrerNouveauTrajet () :void {

    this.nouveauTrajet = this.trajetService.demarrerNouveauTrajet(1, this.selectedMean);
  }


  constructor(private trajetService: TrajetService) {
    let trajetMeansKeys : string[] =  Object.keys(TrajetMeans);
    trajetMeansKeys.forEach (v => {

      let m:TrajetMeans = <TrajetMeans>TrajetMeans[v];
      if (m) {
        this.trajetMeansEnum.push(m);
      }
    });

   }

   onSelect(mean: TrajetMeans) {
    this.selectedMean = mean;
  }
  ngOnInit(): void {
  }

}

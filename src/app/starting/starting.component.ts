import { Component, OnInit, ViewChild } from '@angular/core';
import { TrajetMeans } from '../trajets/trajet-means.enum';
import { TrajetMeansIconComponent } from '../trajets/trajet-means-icon/trajet-means-icon.component';



@Component({
  selector: 'app-starting',
  templateUrl: './starting.component.html',
  styleUrls: ['./starting.component.css']
})
export class StartingComponent implements OnInit {

  
  trajetMeansEnum : TrajetMeans[] = [];
  selectedMean: TrajetMeans;

  diplaySelectedMeanDescription ():string {

    if (this.selectedMean) {
      return TrajetMeansIconComponent.displayName(this.selectedMean);
    } else {
      return "";
    }
  }


  constructor() {
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

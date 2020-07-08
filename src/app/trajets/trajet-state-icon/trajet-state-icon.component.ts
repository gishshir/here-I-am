import { Component, OnInit, Input } from '@angular/core';
import { TrajetState } from '../trajet-etat.enum';

@Component({
  selector: 'app-trajet-state-icon',
  templateUrl: './trajet-state-icon.component.html',
  styleUrls: ['./trajet-state-icon.component.css']
})
export class TrajetStateIconComponent implements OnInit {

  @Input() trajetState: TrajetState;

  constructor() { }

  ngOnInit(): void {
  }

  getDescription () : string {

    let description: string = "";
    switch (this.trajetState) {

      case TrajetState.started: description = "Trajet en cours..."; break;
      case TrajetState.ended: description = "Trajet terminé."; break;
      case TrajetState.pausing: description = "Pause pendant le trajet"; break;
  
    }
    return description;
  }

}

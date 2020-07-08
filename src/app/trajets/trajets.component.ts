import { Component, OnInit } from '@angular/core';
import { Trajet } from './trajet.type';
import { TrajetService } from './trajet.service';
import { TrajetState } from './trajet-etat.enum';
import { ToolsService } from '../tools.service';
import { LoggerService } from '../logger.service';



@Component({
  selector: 'app-trajets',
  templateUrl: './trajets.component.html',
  styleUrls: ['./trajets.component.css']
})
export class TrajetsComponent implements OnInit {

  trajets :Trajet[];
  selectedTrajet :Trajet;
  today: string;

  constructor(private trajetService: TrajetService, private toolsService: ToolsService,
    private logger: LoggerService) {
    this.trajets = trajetService.getTrajets (1);
    this.today = toolsService.formatDate (new Date().getTime()); 
   }

  // started & pausing: date de depart
  // ended: date fin trajet
  getStartOrEndDate (trajetid: number): string {

    let trajet = this.trajetService.getTrajetById(trajetid);
    if (trajet != null) {

      let timestamp: number;
      switch (trajet.etat) {
        case TrajetState.started:
        case TrajetState.pausing:
          timestamp = trajet.startDate;
          break;

        case TrajetState.ended:
          timestamp = trajet.endDate;
          break;
      }

      return this.toolsService.formatDateAndTime(timestamp);

    } else {
      return "";
    }
  }

  // event en provenant de trajet-detail
  onChangeState (state: TrajetState) : void {

    this.logger.log("onChangeState(): " + state);
    // on rafraichit la liste
    this.trajets = this.trajetService.getTrajets (1);
  }


  onSelect(trajet: Trajet) {
    this.selectedTrajet = trajet;
  }

  ngOnInit(): void {
  }

}

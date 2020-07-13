import { Component, OnInit } from '@angular/core';
import { Trajet } from './trajet.type';
import { TrajetService } from './trajet.service';
import { TrajetState } from './trajet-etat.enum';
import { ToolsService } from '../common/tools.service';
import { LoggerService } from '../common/logger.service';
import { Message } from '../common/message.type';




@Component({
  selector: 'app-trajets',
  templateUrl: './trajets.component.html',
  styleUrls: ['./trajets.component.css']
})
export class TrajetsComponent implements OnInit {

  trajets: Trajet[];
  selectedTrajet: Trajet;
  today: string;

  response: Message;

  constructor(private trajetService: TrajetService, private toolsService: ToolsService,
    private logger: LoggerService) {
    this.today = toolsService.formatDate(new Date().getTime());
    this.refreshList(-1);
  }

  // reception d'un evenement de message
  onMessage(response: Message) {
    this.response = response;
  }

  // event en provenant de trajet-detail
  onChangeState(state: TrajetState): void {

    this.logger.log("onChangeState(): " + state);
    // on rafraichit la liste des trajets
    this.refreshList(this.selectedTrajet.id);
  }


  /**
   * Rafraichissement de la liste et nouveau pointeur sur selectedTrajet
   * @param selectedid 
   */
  private refreshList(selectedid: number): void {
    this.logger.log("rafraichir la liste des trajets");

    this.trajetService.getListeTrajets({

      onGetList: list => {
        this.trajets = list;
        this.selectedTrajet = this.trajetService.chercherTrajetById(selectedid);
      },
      onError: m => this.response = m
    });


  }



  // started & pausing: date de depart
  // ended: date fin trajet
  getStartOrEndDate(trajetid: number): string {

    let trajet = this.trajetService.getTrajetById(trajetid);
    if (trajet != null) {

      let timestamp: number;
      switch (trajet.etat) {
        case TrajetState.started:
        case TrajetState.pausing:
          timestamp = trajet.starttime;
          break;

        case TrajetState.ended:
          timestamp = trajet.endtime;
          break;
      }

      return this.toolsService.formatDateAndTime(timestamp);

    } else {
      return "";
    }
  }



  onSelect(trajet: Trajet) {
    this.selectedTrajet = trajet;
  }

  ngOnInit(): void {
  }

}

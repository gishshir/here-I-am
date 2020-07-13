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
    this.refreshList();
  }

  private refreshList(): void {
    this.logger.log("rafraichir la liste des trajets");

    this.trajetService.getListeTrajets({

      onGetList: list => this.trajets = list,
      onError: m => this.response = m
    });


  }


  /*this.trajetService.mettreEnCache(this.trajets = []);
  this.trajetService.getListeTrajets().subscribe(
    // next
    (datas: Trajet[]) => {
      this.trajets = datas;
      this.trajetService.mettreEnCache(this.trajets);
    },
    // error
    (error: string) => this.response = {
      msg: error,
      error: true
    }

  )*/


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

  // event en provenant de trajet-detail
  onChangeState(state: TrajetState): void {

    this.logger.log("onChangeState(): " + state);
    // on rafraichit la liste
    this.refreshList();
  }


  onSelect(trajet: Trajet) {
    this.selectedTrajet = trajet;
  }

  ngOnInit(): void {
  }

}

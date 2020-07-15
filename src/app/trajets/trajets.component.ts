import { Component, OnInit } from '@angular/core';
import { Trajet } from './trajet.type';
import { TrajetService } from './trajet.service';
import { TrajetState } from './trajet-etat.enum';
import { ToolsService } from '../common/tools.service';
import { LoggerService } from '../common/logger.service';
import { Message } from '../common/message.type';
import { Ami } from '../amis/ami.type';
import { AmiService } from '../amis/ami.service';




@Component({
  selector: 'app-trajets',
  templateUrl: './trajets.component.html',
  styleUrls: ['./trajets.component.css']
})
export class TrajetsComponent implements OnInit {

  trajets: Trajet[];
  selectedTrajet: Trajet;
  today: string;

  listAmis: Ami[];

  response: Message;

  constructor(private trajetService: TrajetService, private toolsService: ToolsService,
    private logger: LoggerService, private amiService: AmiService) {
    this.today = toolsService.formatDate(new Date().getTime());
    this.refreshList(-1);
  }

  // reception d'un evenement de message
  onMessage(response: Message) {
    this.response = response;
  }

  // event en provenant de trajet-detail
  onChangeState(trajet: Trajet): void {

    this.logger.log("onChangeState(): " + trajet.etat);
    // on rafraichit la liste des trajets
    this.selectedTrajet = trajet;
    this.updateList(trajet);
  }

  // update de la liste en mémoire
  // pas la peine de faire un appel remote!
  private updateList(trajet: Trajet): void {

    let list: Trajet[] = [];

    this.trajets.forEach(t => {

      if (t.id != trajet.id) {
        list.push(t);
      } else {
        // nouvelle ref
        list.push(trajet);
      }
    });

    this.trajets = list;

  }

  supprimerTrajet(trajet: Trajet): void {

    this.trajetService.deleteTrajet(trajet, {

      onMessage: (m: Message) => {

        this.response = m;
        this.refreshList(-1);
      },
      onError: (e: Message) => this.response = e
    });
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
        this.selectedTrajet = this.getTrajetById(selectedid);
      },
      onError: m => this.response = m
    });


  }


  chercherListAmis(): Ami[] {
    console.log("chercherListAmis()");

    if (this.listAmis == null) {

      this.amiService.getListeAmis({
        onGetList: (l: Ami[]) => this.listAmis = l,
        onError: (e: Message) => console.log(e.msg)
      });
    }

    return this.listAmis;
  }




  // started & pausing: date de depart
  // ended: date fin trajet
  getStartOrEndDate(trajetid: number): string {

    let trajet = this.getTrajetById(trajetid);
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

  private getTrajetById(trajetid: number): Trajet {

    return this.trajets.find(t => t.id == trajetid);

  }



  onSelect(trajet: Trajet) {
    this.response = null;
    this.selectedTrajet = trajet;
  }

  ngOnInit(): void {
  }

}

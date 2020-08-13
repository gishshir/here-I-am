import { Component, OnInit } from '@angular/core';
import { Trajet, TrajetState } from './trajet.type';
import { TrajetService } from './trajet.service';
import { ToolsService } from '../common/tools.service';
import { LoggerService } from '../common/logger.service';
import { Message } from '../common/message.type';
import { DialogDeleteTrajetComponent } from './dialog-delete/dialog-delete-trajet.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotificationService } from '../common/notification/notification.service';




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
    private logger: LoggerService, public dialog: MatDialog,
    private notificationService: NotificationService) {
    this.today = toolsService.formatDate(new Date().getTime() / 1000);
    // s'inscrit aux evenements de changement de trajet ou etat de trajet
    this.notificationService.monTrajet$.subscribe((t: Trajet) => this.onChangeState(t));
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

  confirmSupprimerTrajet(trajet: Trajet): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      id: trajet.id,
      startdate: "" + trajet.starttime,
      mean: trajet.mean
    };

    const dialogRef = this.dialog.open(DialogDeleteTrajetComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.supprimerTrajet(trajet);
        }
      }
    );
  }

  private supprimerTrajet(trajet: Trajet): void {

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

  displayDescriptionTrajet(t: Trajet): string {

    let description = "";
    if (t) {

      description = "Du " + this.toolsService.formatDateAndTime(t.starttime) + " au "
        + (t.etat == TrajetState.ended ? this.toolsService.formatDateAndTime(t.endtime) : "...");
    }
    return description;
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



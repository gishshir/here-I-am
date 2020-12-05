import { Component, OnInit, ViewChild } from '@angular/core';
import { OldTrajetsInfo, Trajet, TrajetState } from './trajet.type';
import { TrajetService } from './trajet.service';
import { ToolsService } from '../common/tools.service';
import { LoggerService } from '../common/logger.service';
import { Message } from '../common/message.type';
import { DialogDeleteTrajetComponent } from './dialog-delete/dialog-delete-trajet.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotificationService } from '../common/notification/notification.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDeleteOldTrajetsComponent } from './dialog-delete-old/dialog-delete-old.component';


const NAME = "TrajetsComponent";

@Component({
  selector: 'app-trajets',
  templateUrl: './trajets.component.html',
  styleUrls: ['./trajets.component.scss']
})
export class TrajetsComponent implements OnInit {

  selectedTrajet: Trajet;
  today: string;

  // Vieux trajets à  supprimer
  oldTrajetsInfo: OldTrajetsInfo;

  response: Message;

  // material table
  tableColumns: string[] = ['item'];
  dataSource: MatTableDataSource<Trajet> = new MatTableDataSource<Trajet>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private trajetService: TrajetService, private toolsService: ToolsService,
    private logger: LoggerService, public dialog: MatDialog,
    private notificationService: NotificationService) {
    this.today = toolsService.formatDate(this.toolsService.getNowTimestampEnSec());
    // s'inscrit aux evenements de changement de trajet ou etat de trajet
    this.notificationService.monTrajet$.subscribe((t: Trajet) => this.onChangeState(t));

    this.chercherTrajetsASupprimer();
    this.refreshList(-1);
  }
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // reception d'un evenement de message
  onMessage(response: Message) {
    this.response = response;
  }

  // event en provenant de trajet-detail
  onChangeState(trajet: Trajet): void {

    this.logger.log(NAME, "onChangeState(): " + trajet.etat);
    // on rafraichit la liste des trajets
    this.selectedTrajet = trajet;
    this.updateList(trajet);
  }


  // update de la liste en mémoire
  // pas la peine de faire un appel remote!
  private updateList(trajet: Trajet): void {

    let list: Trajet[] = [];

    this.dataSource.data.forEach(t => {

      if (t.id != trajet.id) {
        list.push(t);
      } else {
        // nouvelle ref
        list.push(trajet);
      }
    });

    this.dataSource.data = list;

  }

  confirmSupprimerOldTrajets(): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      oldTrajetsInfo: this.oldTrajetsInfo
    };

    const dialogRef = this.dialog.open(DialogDeleteOldTrajetsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.supprimerOldTrajets();
        }
      }
    );
  }

  private supprimerOldTrajets(): void {
    console.log("supprimerOldTrajets()");
    this.trajetService.deleteOldTrajets(this.oldTrajetsInfo, {

      onMessage: (m: Message) => {
        this.response = m,
          this.refreshList(-1);
      },
      onError: (e: Message) => this.response = e

    }


    );
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

  private chercherTrajetsASupprimer(): void {

    this.logger.log(NAME, "chercher nombre de trajets à supprimer");
    this.trajetService.findNumberOfOldTrajetToDelete({

      onResponse: (info: OldTrajetsInfo) => {
        console.log(info.nombre + " trajets à supprimer...");
        this.oldTrajetsInfo = info;
      },
      onError: (e: Message) => this.response = e
    });
  }


  /**
   * Rafraichissement de la liste et nouveau pointeur sur selectedTrajet
   * @param selectedid 
   */
  private refreshList(selectedid: number): void {
    this.logger.log(NAME, "rafraichir la liste des trajets");

    this.trajetService.getListeTrajets({

      onGetList: list => {
        this.dataSource = new MatTableDataSource<Trajet>(list);
        this.dataSource.paginator = this.paginator;
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

    return this.dataSource.data.find(t => t.id == trajetid);

  }



  onSelect(trajet: Trajet) {
    this.response = null;
    this.selectedTrajet = trajet;
  }



}



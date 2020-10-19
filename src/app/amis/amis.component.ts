import { Component, OnInit, ViewChild, Predicate } from '@angular/core';
import { Ami } from './ami.type';
import { AmiService } from './ami.service';
import { LoggerService } from '../common/logger.service';
import { Message } from '../common/message.type';
import { MatRadioChange } from '@angular/material/radio';
import { RelationState, RelationInfo } from './relation/relationinfo.type';
import { AmisFilter } from './amis.pipe';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { DialogInvitationComponent } from './dialog-invitation/dialog-invitation.component';
import { AmiRelation } from './amiinfo.type';
import { NotificationService } from '../common/notification/notification.service';
import { Trajet } from '../trajets/trajet.type';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-amis',
  templateUrl: './amis.component.html',
  styleUrls: ['./amis.component.css']
})
export class AmisComponent implements OnInit {

  private amis: Ami[];
  selectedAmi: Ami;
  selectedAmiTrajet: Trajet;
  selectedFilter: string = AmisFilter.valide;
  response: Message;

  suivreTrajetAmiAutorise: boolean = true;

  private _listToUpdate: boolean = false;

  // material table
  tableColumns: string[] = ['item'];
  dataSource: MatTableDataSource<Ami> = new MatTableDataSource<Ami>();
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private amiService: AmiService, private logger: LoggerService, private dialog: MatDialog,
    private notificationService: NotificationService) {

    // abonnement au changement de trajet (ou etat de trajet)
    // de l'ami en cours
    this.notificationService.amiTrajet$.subscribe(
      (trajet?: Trajet) => {
        let changementEtat: boolean =
          (this.selectedAmiTrajet && (this.selectedAmiTrajet.etat != trajet.etat)) ? true : false;
        this.selectedAmiTrajet = trajet;
        logger.log("selectedAmiTrajet: " + (trajet ? trajet.etat : "null") + " changement etat: " + changementEtat);

        if (changementEtat) {
          this.refreshList();
        }
      }
    );
  }

  ngOnInit(): void {
    this.refreshList();
  }


  onRadioChange($event: MatRadioChange) {

    console.log($event.source.name, $event.value);
    this.dataSource.filter = $event.value;
    if (!this.selectedAmi) {
      return;
    }

    if ($event.value = AmisFilter.valide) {

      // il y a eu au moins une mise à jour de relation
      if (this._listToUpdate) {

        this.refreshList();
        this._listToUpdate = false;
      }
      // acune mise à jour de relation
      else if (this.selectedAmi.etatrelation != RelationState.open) {
        this.selectedAmi = null;
      }


    }
  }

  // reception d'un evenement de suppression d'une relation
  onDelete(ami: Ami) {
    this.selectedAmi = null;
    this.refreshList();
  }

  // reception d'un evenement de changement de suivi de l'ami
  // on s'assure si l'ami de son coté autorise son suivi par l'envoi de notification
  // attention AmiRelation contient l'information du point de vue de l'ami
  onSuivre(ami: Ami) {

    console.log("onSuivre() " + this.selectedAmi.suivre);
    this.refreshSuivreTrajetAmiAutorise();

  }

  refreshSuivreTrajetAmiAutorise() {
    if (this.selectedAmi.suivre) {

      this.suivreTrajetAmiAutorise = true;
      this.amiService.getRelationPointVueAmi(this.selectedAmi.idrelation, {

        onGetAmiRelation: (amiRelation: AmiRelation) => this.suivreTrajetAmiAutorise = amiRelation.notifier,
        onError: (e: Message) => this.response = e

      });
    } else {
      this.selectedAmiTrajet = null;
    }
  }

  // reception d'un evenement de modification de l'etat de la relation
  // la liste sera à mettre à jour si on passe du filtre 'tous' au filtre 'valides'
  onUpdateRelation(relationInfo: RelationInfo) {
    this._listToUpdate = true;
  }

  // reception d'un evenement de message
  onMessage(response: Message) {
    this.response = response;
  }
  // reception d'un evenement de modification d'un Ami
  // onChange(ami: Ami) {
  //   // rafraichir la liste complète
  //   this.logger.log("event de modification de l'ami (rel): " + ami.idrelation);
  //   this.refreshList();
  // }




  private refreshList(): void {
    this.logger.log("rafraichir la liste des amis");

    // on mémorise l'ami selectionne avant le rafraichissement si existe
    let selectedRelationId: number = (this.selectedAmi) ? this.selectedAmi.idrelation : undefined;
    this.logger.log("selectedRelationId: " + selectedRelationId);

    this.selectedAmi = null;
    this.amis = [];
    this.amiService.getListeAmis(
      {
        onGetList: list => {
          this.amis = list;

          this.dataSource = new MatTableDataSource<Ami>(list);
          this.dataSource.paginator = this.paginator;
          this.dataSource.filterPredicate = this.amiService.createEtaRelationFilter();
          this.dataSource.filter = this.selectedFilter;

          let ami = this.findSelectedAmi(selectedRelationId);
          if (ami && this.selectedFilter) {
            switch (this.selectedFilter) {

              case AmisFilter.tous: this.selectedAmi = ami; break;
              case AmisFilter.valide: {
                if (RelationState.open) {
                  this.selectedAmi = ami;
                }
                break;
              }
              case AmisFilter.aValider: {
                if (RelationState.pending) {
                  this.selectedAmi = ami;
                }
                break;
              }
              case AmisFilter.refuse: {
                if (RelationState.closed) {
                  this.selectedAmi = ami;
                }
                break;
              }
            }
          }


        },
        onError: e => this.response = e
      }
    );
  }

  // on cherche un ami dans la liste par son idrelation
  findSelectedAmi(selectedRelationId: number) {

    if (selectedRelationId) {

      return this.amis.find(ami => ami.idrelation === selectedRelationId);
    }
    return null;
  }

  onSelect(ami: Ami) {
    this.selectedAmiTrajet = null;
    this.selectedAmi = ami;
    this.response = null;
    this.refreshSuivreTrajetAmiAutorise();
  }

  openDialogLancerInvitation() {
    const dialogConfig = new MatDialogConfig();

    //dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      id: -1
    };
    dialogConfig.panelClass = ["dialog-inviter"];

    const dialogRef = this.dialog.open(DialogInvitationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.response = data.message;
          if (!this.response.error) {
            this.getNouvelAmiAndRefreshList(data.idperson);
          }
        }
      }
    );

  }

  getNouvelAmiAndRefreshList(idperson: number): void {

    this.amiService.getAmiByIdPerson(idperson, {

      onError: (e: Message) => this.response = e,
      onGetAmi: (ami: Ami) => {

        this.selectedAmi = ami;
        this.selectedFilter = AmisFilter.tous;
        this.refreshList();
      }
    });

  }



}

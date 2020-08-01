import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Ami, AmiState } from '../ami.type';
import { AmiService } from '../ami.service';
import { RelationService } from '../relation/relation.service';
import { Message } from '../../common/message.type';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogDeleteTrajetComponent } from 'src/app/trajets/dialog-delete/dialog-delete-trajet.component';
import { DialogDeleteRelationComponent } from '../relation/dialog-delete/dialog-delete-relation.component';

@Component({
  selector: 'app-ami-detail',
  templateUrl: './ami-detail.component.html',
  styleUrls: ['./ami-detail.component.css']
})
export class AmiDetailComponent implements OnInit {

  _amiDetail: Ami;

  @Output() eventDelete = new EventEmitter<Ami>();
  @Output() eventSuivre = new EventEmitter<Ami>();
  @Output() eventNotifier = new EventEmitter<Ami>();
  @Output() eventMessage = new EventEmitter<Message>();

  @Input()
  set amiDetail(ami: Ami) {
    this._amiDetail = ami;
  }

  get amiDetail(): Ami {
    return this._amiDetail;
  }

  constructor(private amiService: AmiService, private relationService: RelationService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  supprimerRelation() {

    this.relationService.deleteRelation(this._amiDetail.idrelation, {

      onMessage: (m: Message) => {
        this.eventMessage.emit(m);
        this.eventDelete.emit(this._amiDetail);
      },
      onError: (e: Message) => this.eventMessage.emit(e)
    });
  }

  confirmSupprimerRelation(): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      ami: this._amiDetail
    };

    const dialogRef = this.dialog.open(DialogDeleteRelationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.supprimerRelation();
        }
      }
    );
  }



  updateSuivreAmi() {

    // mettre à jour la bdd distante
    this.amiDetail.suivre = !this.amiDetail.suivre;

    this.amiService.updateSuivreAmi(this.amiDetail, {

      onMessage: (m: Message) => {
        this.eventMessage.emit(m);
        this.eventSuivre.emit(this.amiDetail);
      },
      onError: (e: Message) => {
        this.eventMessage.emit(e);
        this.amiDetail.suivre = !this.amiDetail.suivre;
      }
    });

  }
  updateNotifierAmi() {

    // mettre à jour la bdd distante
    this.amiDetail.notifier = !this.amiDetail.notifier;

    this.amiService.updateNotifierAmi(this.amiDetail, {

      onMessage: (m: Message) => {
        this.eventMessage.emit(m);
        this.eventNotifier.emit(this.amiDetail);
      },
      onError: (e: Message) => {
        this.eventMessage.emit(e);
        this.amiDetail.notifier = !this.amiDetail.notifier;
      }
    });

  }

}

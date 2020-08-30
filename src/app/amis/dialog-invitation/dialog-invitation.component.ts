import { Component, OnInit, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { AmiPersonne } from '../amiinfo.type';
import { AmiService } from '../ami.service';
import { Message } from 'src/app/common/message.type';
import { DialogConfirmInvitationComponent } from './confirm/dialog-confirm-invitation.component';
import { RelationService } from '../relation/relation.service';
import { MatTableDataSource } from '@angular/material/table';
import { Ami } from '../ami.type';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-dialog-invitation',
  templateUrl: './dialog-invitation.component.html',
  styleUrls: ['./dialog-invitation.component.scss']
})
export class DialogInvitationComponent implements OnInit {

  id: number;
  selectedPersonne: AmiPersonne;

  // material table
  tableColumns: string[] = ['item'];
  dataSource: MatTableDataSource<AmiPersonne> = new MatTableDataSource<AmiPersonne>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private amiService: AmiService, private relationService: RelationService, private dialog: MatDialog,
    private dialogRef: MatDialogRef<DialogInvitationComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.id = data.id;
  }

  doFilter(pseudoFilter: string): void {

    if (!pseudoFilter) {
      pseudoFilter = "*";
    }
    this.dataSource.filter = pseudoFilter.trim().toLowerCase();
  }
  createPseudoFilter() {

    let filterFunction = function (ami: AmiPersonne, filter: string): boolean {

      if (!filter || filter == "*") {
        return true;
      }
      let result: boolean = ami.pseudo.toLowerCase().search(filter) > -1
      return result;
    }

    return filterFunction;
  }

  ngOnInit(): void {

    this.amiService.getListePersonneNonAmis({

      onGetList: (list: AmiPersonne[]) => {

        this.dataSource = new MatTableDataSource<AmiPersonne>(list);
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.createPseudoFilter();
        this.dataSource.filter = "*";

      },
      onError: (e: Message) => console.log(e.msg)

    });
  }
  onSelect(personne: AmiPersonne) {
    this.selectedPersonne = personne;
    this.openDialogConfirmerInvitation();
  }


  openDialogConfirmerInvitation() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      personne: this.selectedPersonne
    };

    const dialogRef = this.dialog.open(DialogConfirmInvitationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (data: string) => {
        if (data) {
          this.inviter();
        }
      }
    );
  }

  close() {
    this.dialogRef.close();
  }

  inviter() {
    console.log("inviter " + this.selectedPersonne.pseudo);
    this.relationService.createInvitation(this.selectedPersonne.id, {
      onError: (e: Message) =>
        this.dialogRef.close({ message: e, idperson: -1 })
      ,
      onMessage: (m: Message) => {

        if (!m.error) {
          console.log("invitation envoyée pour " + this.selectedPersonne.pseudo);
          let data = {
            message: { msg: "invitation envoyée!", error: false },
            idperson: this.selectedPersonne.id
          };
          this.dialogRef.close(data);

        } else {
          this.dialogRef.close({ message: m, idperson: -1 })
        }
      }
    })
  }


}

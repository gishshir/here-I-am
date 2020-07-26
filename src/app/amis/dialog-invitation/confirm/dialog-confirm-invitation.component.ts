import { Component, OnInit, Inject } from '@angular/core';
import { AmiPersonne } from '../../amiinfo.type';
import { AmiService } from '../../ami.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirm-invitation',
  templateUrl: './dialog-confirm-invitation.component.html',
  styleUrls: ['./dialog-confirm-invitation.component.scss']
})
export class DialogConfirmInvitationComponent implements OnInit {

  personne: AmiPersonne;


  constructor(private amiService: AmiService,
    private dialogRef: MatDialogRef<DialogConfirmInvitationComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.personne = data.personne
  }

  ngOnInit(): void {
  }

  inviter() {
    this.dialogRef.close("inviter");
  }

  close() {
    this.dialogRef.close();
  }


}

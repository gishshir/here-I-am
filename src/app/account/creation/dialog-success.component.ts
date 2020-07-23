import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-success',
  templateUrl: './dialog-success.component.html',
  styleUrls: ['./dialog-success.component.scss']
})
export class DialogCreateAccountSuccessComponent implements OnInit {

  login: string;
  pseudo: string;

  constructor(
    private dialogRef: MatDialogRef<DialogCreateAccountSuccessComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.login = data.login;
    this.pseudo = data.pseudo;
  }

  ngOnInit(): void {
  }

  continuer() {
    this.dialogRef.close("continuer");
  }

  close() {
    this.dialogRef.close();
  }

}

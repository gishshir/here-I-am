import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-success',
  templateUrl: './dialog-success.component.html',
  styleUrls: ['./dialog-success.component.scss']
})
export class DialogCreateAccountSuccessComponent implements OnInit {

  title: string;
  login: string;
  pseudo: string;
  message: string;
  redirectmessage: string;

  constructor(
    private dialogRef: MatDialogRef<DialogCreateAccountSuccessComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.title = data.title;
    this.message = data.message;
    this.redirectmessage = data.redirectmessage,
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

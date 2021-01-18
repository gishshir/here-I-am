import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-unlock',
  templateUrl: './dialog-unlock.component.html',
  styleUrls: ['./dialog-unlock.component.scss']
})
export class DialogUnlockComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DialogUnlockComponent>) { }

  ngOnInit(): void {
  }


  unlock() {
    this.dialogRef.close("unlock");
  }

  close() {
    this.dialogRef.close();
  }

}

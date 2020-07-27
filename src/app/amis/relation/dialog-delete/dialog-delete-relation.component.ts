import { Component, OnInit, Inject } from '@angular/core';
import { Ami } from '../../ami.type';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-delete-relation',
  templateUrl: './dialog-delete-relation.component.html',
  styleUrls: ['./dialog-delete-relation.component.scss']
})
export class DialogDeleteRelationComponent implements OnInit {

  ami: Ami;


  constructor(
    private dialogRef: MatDialogRef<DialogDeleteRelationComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.ami = data.ami;

  }

  ngOnInit(): void {
  }

  delete() {
    this.dialogRef.close("delete");
  }

  close() {
    this.dialogRef.close();
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToolsService } from 'src/app/common/tools.service';

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.scss']
})
export class DialogDeleteTrajetComponent implements OnInit {

  id: number;
  startdate: string;
  mean: string;

  constructor(private toolsService: ToolsService,
    private dialogRef: MatDialogRef<DialogDeleteTrajetComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.id = data.id;
    this.startdate = this.toolsService.formatDateAndTime(data.startdate);
    this.mean = data.mean;
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

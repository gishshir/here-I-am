import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToolsService } from 'src/app/common/tools.service';
import { DialogDeleteTrajetComponent } from '../dialog-delete/dialog-delete-trajet.component';
import { OldTrajetsInfo } from '../trajet.type';

@Component({
  selector: 'app-dialog-delete-old',
  templateUrl: './dialog-delete-old.component.html',
  styleUrls: ['./dialog-delete-old.component.scss']
})
export class DialogDeleteOldTrajetsComponent implements OnInit {

  oldTrajetsInfo: OldTrajetsInfo;
  beforeDate: string;

  constructor(private tools: ToolsService,
    private dialogRef: MatDialogRef<DialogDeleteTrajetComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.oldTrajetsInfo = data.oldTrajetsInfo;
    this.beforeDate = this.tools.formatDateJourMoisYY(this.oldTrajetsInfo.beforeTs);
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

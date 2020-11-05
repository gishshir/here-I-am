import { Component, OnInit, Inject } from '@angular/core';
import { AppPosition } from 'src/app/trajets/position.type';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeolocationService } from '../geolocation.service';
import { PositionService } from '../position.service';
import { ToolsService } from 'src/app/common/tools.service';

@Component({
  selector: 'app-dialog-geolocation',
  templateUrl: './dialog-geolocation.component.html',
  styleUrls: ['./dialog-geolocation.component.scss']
})
export class DialogGeolocationComponent implements OnInit {


  titre: string;

  constructor(private positionService: PositionService, private tools: ToolsService,
    private dialogRef: MatDialogRef<DialogGeolocationComponent>, @Inject(MAT_DIALOG_DATA) data) {

    this.titre = data.titre;
  }

  openMaps(p: AppPosition) {
    let url = this.positionService.buildUrlToMaps(p);
    if (url) {
      this.tools.openNewWindow(url);
    }
  }


  ngOnInit(): void {
  }


  close() {
    this.dialogRef.close();
  }
}

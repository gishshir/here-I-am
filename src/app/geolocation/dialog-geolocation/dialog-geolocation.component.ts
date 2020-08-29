import { Component, OnInit, Inject } from '@angular/core';
import { AppPosition } from 'src/app/trajets/position.type';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeolocationService } from '../geolocation.service';

@Component({
  selector: 'app-dialog-geolocation',
  templateUrl: './dialog-geolocation.component.html',
  styleUrls: ['./dialog-geolocation.component.scss']
})
export class DialogGeolocationComponent implements OnInit {


  titre: string;

  constructor(
    private dialogRef: MatDialogRef<DialogGeolocationComponent>, @Inject(MAT_DIALOG_DATA) data) {

    this.titre = data.titre;
  }


  ngOnInit(): void {
  }


  close() {
    this.dialogRef.close();
  }
}

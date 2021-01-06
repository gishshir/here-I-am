import { Component, Input, OnInit } from '@angular/core';
import { Alerte, AlerteType } from '../alerte.type';

@Component({
  selector: 'app-alerte',
  templateUrl: './alerte.component.html',
  styleUrls: ['./alerte.component.scss']
})
export class AlerteComponent implements OnInit {


  @Input() alerte: Alerte;


  constructor() {
  }

  ngOnInit(): void {

  }

  getIcon(): string {

    let icon: string = null;
    if (this.alerte) {
      if (this.alerte.type == AlerteType.warn) {
        icon = "warning";
      } else {
        icon = "info"
      }
    }
    return icon;
  }

  getIconColor(): string {

    let color: string = null;
    if (this.alerte) {
      if (this.alerte.type == AlerteType.warn) {
        color = "warn";
      } else {
        color = "primary"
      }
    }
    return color;
  }




}

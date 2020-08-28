import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../common/notification/notification.service';
import { TrajetService } from '../trajets/trajet.service';
import { Message } from '../common/message.type';
import { AppPosition } from '../trajets/position.type';
import { GeolocationService } from './geolocation.service';
import { ToolsService } from '../common/tools.service';
import { PositionService } from './position.service';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit, OnDestroy {


  @Input() titre: string = "Ma position actuelle";
  appPosition: AppPosition;

  // url pour voir la localisation sur google maps
  urlToMaps: string;

  @Input() showLienToMaps: boolean = true;

  constructor(private geolocationService: GeolocationService,
    private positionService: PositionService,
    private notificationService: NotificationService,
    private tools: ToolsService) {

    this.setPosition(this.geolocationService.getCurrentPosition());

    // s'abonne aux evenements de changement de position
    this.notificationService.maPosition$.subscribe(
      (p: AppPosition) => {
        this.setPosition(p);
      }
    )
  }


  private setPosition(p: AppPosition): void {
    this.appPosition = p;
    this.urlToMaps = this.positionService.buildUrlToMaps(p);
  }


  ngOnInit(): void {
  }

  ngOnDestroy() {

  }

  displayDate(): string {

    if (this.appPosition) {
      return this.tools.formatDateJourMoisYY(this.appPosition.timestamp);
    } else {
      return "";
    }
  }

  displayTime(): string {

    if (this.appPosition) {
      return this.tools.formatTime(this.appPosition.timestamp);
    } else {
      return "";
    }
  }


}

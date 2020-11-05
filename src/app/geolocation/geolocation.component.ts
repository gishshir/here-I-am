import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../common/notification/notification.service';
import { Message } from '../common/message.type';
import { AppPosition } from '../trajets/position.type';
import { GeolocationService } from './geolocation.service';
import { ToolsService } from '../common/tools.service';
import { PositionService } from './position.service';

/*
* composant interne utilise dans
* - dialog-geolocation
* - trajet-geolocation
* abonné aux changements de positions (gps)
* ne connait rien du trajet en cours
**/
@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit, OnDestroy {


  @Input()
  titre: string = "Ma position actuelle";

  appPosition: AppPosition;

  geoMessage: Message;

  // url pour voir la localisation sur google maps ou geoportail
  @Input()
  url: string;

  @Input() showLienToMaps: boolean = true;

  constructor(private geolocationService: GeolocationService,
    private notificationService: NotificationService,
    private tools: ToolsService) {

    this.setPosition(this.geolocationService.getCurrentPosition());

    // s'abonne aux evenements de changement de position
    this.notificationService.maPosition$.subscribe(
      (p: AppPosition) => {
        this.setPosition(p);
      }
    )

    // abonnement aux evenements de geolocalisation
    this.notificationService.emitGeoMessage$.subscribe(
      (m: Message) => this.geoMessage = m
    );
  }

  openMaps() {
    if (this.url) {
      console.log("open geoportail: " + this.url);
      this.tools.openNewWindow(this.url);
    }
  }

  private setPosition(p: AppPosition): void {
    this.appPosition = p;
    this.geoMessage = this.geolocationService.getGeoMessage();
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

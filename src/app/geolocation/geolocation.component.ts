import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NotificationService } from '../common/notification/notification.service';
import { TrajetService } from '../trajets/trajet.service';
import { Message } from '../common/message.type';
import { AppPosition } from '../trajets/position.type';
import { GeolocationService } from './geolocation.service';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit, OnDestroy {


  appPosition: AppPosition;

  // url pour voir la localisation sur google maps
  urlToMaps: string;

  constructor(private geolocationService: GeolocationService, private notificationService: NotificationService) {

    // s'abonne aux evenements de changement de position
    this.notificationService.maPosition$.subscribe(
      (p: AppPosition) => {
        this.appPosition = p;
        this.urlToMaps = this.geolocationService.buildUrlToMaps(p);
      }
    )
  }


  ngOnInit(): void {
  }

  ngOnDestroy() {

  }




}

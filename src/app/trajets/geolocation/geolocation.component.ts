import { Component, OnInit, Input } from '@angular/core';
import { TrajetService } from '../trajet.service';
import { Message } from 'src/app/common/message.type';
import { NotificationService } from 'src/app/common/notification/notification.service';

/*
* Utilise le GPS du system via le navigator pour recuperer
* les informations de positions et les envoyer à la BDD
*/

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit {

  @Input() trajetid: number;
  @Input()
  set activate(activate: boolean) {
    this.initCurrentLocation();
    if (activate) {
      this.startWatch();
    } else {
      this.clearWatch();
    }
  }

  // url pour voir la localisation sur google maps
  urlToMaps: string;

  constructor(private trajetService: TrajetService, private notificationService: NotificationService) {
    if ("geolocation" in navigator) {

      console.log("geolocation existe");
      this.geolocation = true;

    } else {
      console.log("fonction geolocation n'existe pas sur ce navigateur!");
      this.geolocation = false;
    }
  }

  geolocation: boolean;
  latitude: number = -1;
  longitude: number = -1;
  timestampSec: number = -1;

  private oldtimestampSec: number = -1;

  private pid: number = -1;

  private geo_options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 30000
  };

  private initCurrentLocation() {

    if (this.geolocation && this.timestampSec < 0) {

      navigator.geolocation.getCurrentPosition(
        (position: Position) => this.geo_success(position),
        () => this.geo_error(),
        this.geo_options);
    }

  }

  private startWatch() {

    console.log("startWatch()");
    this.notificationService.useNetwork(true);
    if (this.geolocation) {

      this.pid = navigator.geolocation.watchPosition(
        (position: Position) => this.geo_success(position),
        () => this.geo_error(),
        this.geo_options);
    }

  }
  ngOnInit(): void {
  }

  ngOnDestroy() {

    console.log("ngOnDestroy()");
    this.clearWatch();
  }





  private clearWatch() {
    this.notificationService.useNetwork(false);

    if (this.pid >= 0) {
      console.log("clearWatch(): " + this.pid);
      navigator.geolocation.clearWatch(this.pid);
      this.pid = -1;
    }

  }

  private geo_success(position: Position) {

    console.log("geo_success: " + position.timestamp);

    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    this.timestampSec = Math.floor(position.timestamp / 1000);

    this.urlToMaps = this.trajetService.buildUrlToMaps(this.latitude, this.longitude);


    // 10 s pour respirer...
    if (this.oldtimestampSec < 0 || ((this.timestampSec - this.oldtimestampSec) > 10)) {

      console.log("appel du service insererNouvellePosition()...");
      this.oldtimestampSec = this.timestampSec;

      this.trajetService.insererNouvellePosition(this.trajetid, position, {
        onMessage: (m: Message) => console.log(m.msg),
        onError: (e: Message) => console.log(e.msg)
      });

    }
  }
  private geo_error() {
    console.log("Position inconnue!");
    this.clearWatch();
  }
}



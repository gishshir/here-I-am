import { Component, OnInit, Input } from '@angular/core';
import { NotificationService } from '../common/notification/notification.service';
import { TrajetService } from '../trajets/trajet.service';
import { Message } from '../common/message.type';
import { AppPosition } from '../trajets/position.type';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit {


  @Input() trajetid: number;

  // start ou stop la geolocation
  @Input()
  set action(action: ActionGeolocation) {

    if (action == ActionGeolocation.start) {
      this.startWatch();
    } else if (action == ActionGeolocation.stop) {
      this.clearWatch();
    }
  }

  // url pour voir la localisation sur google maps
  urlToMaps: string;
  appPosition: AppPosition;

  // determine si la geolocation est possible ou non sur le navigateur/systeme
  private geolocation: boolean;
  private pid: number = -1;

  private geo_options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 30000
  };
  constructor(private notificationService: NotificationService, private trajetService: TrajetService) {
    if ("geolocation" in navigator) {

      console.log("geolocation existe");
      this.geolocation = true;

    } else {
      console.log("fonction geolocation n'existe pas sur ce navigateur!");
      this.geolocation = false;
    }
  }

  ngOnInit(): void {
  }

  gOnDestroy() {

    console.log("ngOnDestroy()");
    this.clearWatch();
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

    this.appPosition = {

      trajetid: this.trajetid,
      latitude: position.coords.latitude + "",
      longitude: position.coords.longitude + "",
      timestamp: Math.floor(position.timestamp / 1000)
    }

    //this.urlToMaps = this.trajetService.buildUrlToMaps(this.latitude, this.longitude);

    console.log("appel du service insererNouvellePosition()...");
    this.trajetService.insererNouvellePosition(this.trajetid, position, {
      onMessage: (m: Message) => console.log(m.msg),
      onError: (e: Message) => console.log(e.msg)
    });


  }
  private geo_error() {
    console.log("Position inconnue!");
    this.clearWatch();
  }

}

export enum ActionGeolocation {

  start = "start",
  stop = "stop"
}

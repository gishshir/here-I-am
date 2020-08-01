import { Component, OnInit, Input } from '@angular/core';
import { TrajetService } from '../trajet.service';
import { Message } from 'src/app/common/message.type';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit {

  @Input() trajetid: number;
  @Input()
  set activate(activate: boolean) {
    if (activate) {
      this.startWatch();
    } else {
      this.clearWatch();
    }
  }

  constructor(private trajetService: TrajetService) {
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
  timestamp: number = -1;

  private oldtimestamp: number = -1;

  private pid: number = -1;

  private startWatch() {

    console.log("startWatch()");
    if (this.geolocation) {

      var geo_options = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 30000
      };

      this.pid = navigator.geolocation.watchPosition(
        (position: Position) => this.geo_success(position),
        () => this.geo_error(),
        geo_options);
    }

  }
  ngOnInit(): void {
  }

  ngOnDestroy() {

    console.log("ngOnDestroy()");
    this.clearWatch();
  }
  private clearWatch() {

    if (this.pid >= 0) {
      console.log("clearWatch(): " + this.pid);
      navigator.geolocation.clearWatch(this.pid);
      this.pid = -1;
    }

  }

  private geo_success(position: Position) {

    console.log("geo_success: " + position.timestamp);

    let positionDifferente = this.latitude != position.coords.latitude
      || this.longitude != position.coords.longitude;

    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    this.timestamp = position.timestamp;

    // 10 s pour respirer...
    if (this.oldtimestamp < 0 || ((this.timestamp - this.oldtimestamp) > 10000)) {

      if (positionDifferente) {
        console.log("appel du service insererNouvellePosition()...");
        this.oldtimestamp = this.timestamp;

        this.trajetService.insererNouvellePosition(this.trajetid, position, {
          onMessage: (m: Message) => console.log(m.msg),
          onError: (e: Message) => console.log(e.msg)
        });
      }
    }
  }
  private geo_error() {
    console.log("Position inconnue!");
    this.clearWatch();
  }
}



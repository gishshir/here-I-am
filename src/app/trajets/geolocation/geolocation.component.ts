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

  constructor(private trajetService: TrajetService) { }

  geolocation: boolean;
  latitude: number;
  longitude: number;
  timestamp: number;

  private pid: number = -1;

  ngOnInit(): void {

    if ("geolocation" in navigator) {

      console.log("geolocation existe");
      this.geolocation = true;

      //TODO augmenter les valeurs pour eviter
      // de trop soliciter le gps..
      var geo_options = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 30000
      };

      this.pid = navigator.geolocation.watchPosition(
        (position: Position) => this.geo_success(position),
        () => this.geo_error(),
        geo_options);

    } else {
      console.log("fonction geolocation n'existe pas sur ce navigateur!");
      this.geolocation = false;
    }
  }

  ngOnDestroy() {

    if (this.pid > 0) {
      navigator.geolocation.clearWatch(this.pid);
    }

  }

  private geo_success(position: Position) {

    console.log("success: " + position.timestamp);

    let oldtimestamp = this.timestamp ? this.timestamp : 0;

    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    this.timestamp = position.timestamp;

    // 10 s pour respirer...
    if ((this.timestamp - oldtimestamp) > 10000) {
      this.trajetService.insererNouvellePosition(this.trajetid, position, {
        onMessage: (m: Message) => console.log(m.msg),
        onError: (e: Message) => console.log(e.msg)
      });
    }
  }
  private geo_error() {
    console.log("Position inconnue!");
  }
}



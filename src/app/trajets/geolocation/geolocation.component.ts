import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit {

  constructor() { }

  geolocation: boolean;
  latitude: number;
  longitude: number;
  timestamp: number;

  private pid: number = -1;

  ngOnInit(): void {

    if ("geolocation" in navigator) {

      console.log("geolocation existe");
      this.geolocation = true;

      var geo_options = {
        enableHighAccuracy: false,
        maximumAge: 30000,
        timeout: 0
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
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    this.timestamp = position.timestamp;
  }
  private geo_error() {
    console.log("Position inconnue!");
  }
}



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

  ngOnInit(): void {

    if ("geolocation" in navigator) {

      console.log("geolocation existe");
      this.geolocation = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("success");
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        },
        (error) => console.log("error")
      )
    } else {
      console.log("geolocation n'existe pas!");
      this.geolocation = false;
    }
  }
}



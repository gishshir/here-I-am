import { Component, OnInit } from '@angular/core';

import * as Gp from '@ignf-geoportal/sdk-2d';

console.log("Gp: " + Gp);

@Component({
  selector: 'app-geoportail',
  templateUrl: './geoportail.component.html',
  styleUrls: ['./geoportail.component.scss']
})
export class GeoportailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  buildMap(): void {

  }

}

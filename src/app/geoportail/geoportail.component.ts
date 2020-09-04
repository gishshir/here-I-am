import { Component, OnInit } from '@angular/core';

// impossible pour l'instant d'utiliser l'API geoportail avec angular!

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

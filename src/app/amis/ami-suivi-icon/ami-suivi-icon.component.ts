import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ami-suivi-icon',
  templateUrl: './ami-suivi-icon.component.html',
  styleUrls: ['./ami-suivi-icon.component.css']
})
export class AmiSuiviIconComponent implements OnInit {

  @Input() size:number;
  @Input() suivre:boolean;

  constructor() { }

  ngOnInit(): void {
  }

}

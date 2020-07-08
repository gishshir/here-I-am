import { Component, OnInit, Input } from '@angular/core';
import { Ami } from '../ami.type';
import { AmiState } from '../ami.etat.enum';

@Component({
  selector: 'app-ami-detail',
  templateUrl: './ami-detail.component.html',
  styleUrls: ['./ami-detail.component.css']
})
export class AmiDetailComponent implements OnInit {

  @Input() amiDetail: Ami;

  constructor() { }

  ngOnInit(): void {
  }

}

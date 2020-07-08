import { Component, OnInit } from '@angular/core';
import { Ami } from './ami.type';
import { AmiService } from './ami.service';

@Component({
  selector: 'app-amis',
  templateUrl: './amis.component.html',
  styleUrls: ['./amis.component.css']
})
export class AmisComponent implements OnInit {

  amis :Ami[];
  selectedAmi :Ami;

  constructor(amiService: AmiService) {
     this.amis = amiService.getListeAmis();
   }

  ngOnInit(): void {
  }

  onSelect(ami: Ami) {
    this.selectedAmi = ami;
  }

}

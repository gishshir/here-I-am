import { Component, OnInit } from '@angular/core';
import { Ami } from './ami.type';
import { AmiService } from './ami.service';
import { AmiState } from './ami.etat.enum';
import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-amis',
  templateUrl: './amis.component.html',
  styleUrls: ['./amis.component.css']
})
export class AmisComponent implements OnInit {

  amis :Ami[];
  selectedAmi :Ami;

  constructor(private amiService: AmiService, private logger: LoggerService) {

      this.refreshList();
   }

  ngOnInit(): void {
  }

  onChange (ami: Ami) {
    // rafraichir la liste complète
    this.logger.log ("event de modification de l'ami: " + ami.id);
    this.refreshList();
  }

  private refreshList() :void {
    this.logger.log ("rafraichir la liste des amis");
    this.amis = [];
    this.amiService.getListeAmis().subscribe((datas: Ami[]) => {
     
       datas.forEach(a => {
          
          this.amis.push (this.amiService.buildAmiFromJs (a));
       })
    });
  }

  onSelect(ami: Ami) {
    this.selectedAmi = ami;
  }

}

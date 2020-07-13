import { Component, OnInit } from '@angular/core';
import { Ami } from './ami.type';
import { AmiService } from './ami.service';
import { AmiState } from './ami.etat.enum';
import { LoggerService } from '../common/logger.service';
import { Message } from '../common/message.type';
import { AmiInfo } from './amiinfo.type';

@Component({
  selector: 'app-amis',
  templateUrl: './amis.component.html',
  styleUrls: ['./amis.component.css']
})
export class AmisComponent implements OnInit {

  amis: Ami[];
  selectedAmi: Ami;

  response: Message;

  constructor(private amiService: AmiService, private logger: LoggerService) {

    this.refreshList();
  }

  ngOnInit(): void {
  }

  // reception d'un evenement de message
  onMessage(response: Message) {
    this.response = response;
  }
  // reception d'un evenement de modification d'un Ami
  onChange(ami: Ami) {
    // rafraichir la liste complète
    this.logger.log("event de modification de l'ami (rel): " + ami.idrelation);
    this.refreshList();
  }

  private refreshList(): void {
    this.logger.log("rafraichir la liste des amis");
    this.amis = [];
    this.amiService.getListeAmis(
      {
        onGetList: list => this.amis = list,
        onError: e => this.response = e
      }
    );
  }

  onSelect(ami: Ami) {
    this.selectedAmi = ami;
    this.response = null;
  }

}

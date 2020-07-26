import { Component, OnInit } from '@angular/core';
import { Ami } from './ami.type';
import { AmiService } from './ami.service';
import { LoggerService } from '../common/logger.service';
import { Message } from '../common/message.type';
import { MatRadioChange } from '@angular/material/radio';
import { RelationState, RelationInfo } from './relation/relationinfo.type';
import { AmisFilter } from './amis.pipe';


@Component({
  selector: 'app-amis',
  templateUrl: './amis.component.html',
  styleUrls: ['./amis.component.css']
})
export class AmisComponent implements OnInit {

  amis: Ami[];
  selectedAmi: Ami;
  selectedFilter: string = AmisFilter.valides;

  private _listToUpdate: boolean = false;

  response: Message;

  constructor(private amiService: AmiService, private logger: LoggerService) {

    this.refreshList();
  }

  ngOnInit(): void {
  }

  onRadioChange($event: MatRadioChange) {

    console.log($event.source.name, $event.value);
    if (!this.selectedAmi) {
      return;
    }

    if ($event.value = AmisFilter.valides) {

      // il y a eu au moins une mise à jour de relation
      if (this._listToUpdate) {

        this.refreshList();
        this._listToUpdate = false;
      }
      // acune mise à jour de relation
      else if (this.selectedAmi.etatrelation != RelationState.open) {
        this.selectedAmi = null;
      }


    }
  }

  // reception d'un evenement de modification de l'etat de la relation
  // la liste sera à mettre à jour si on passe du filtre 'tous' au filtre 'valides'
  onUpdateRelation(relationInfo: RelationInfo) {
    this._listToUpdate = true;
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

    // on mémorise l'ami selectionne avant le rafraichissement si existe
    let selectedRelationId: number = (this.selectedAmi) ? this.selectedAmi.idrelation : undefined;

    this.selectedAmi = null;
    this.amis = [];
    this.amiService.getListeAmis(
      {
        onGetList: list => {
          this.amis = list;
          let ami = this.findSelectedAmi(selectedRelationId);
          if (ami.etatrelation == RelationState.open) {
            this.selectedAmi = ami;
          }
        },
        onError: e => this.response = e
      }
    );
  }

  // on cherche un ami dans la liste par son idrelation
  findSelectedAmi(selectedRelationId: number) {

    if (selectedRelationId) {

      return this.amis.find(ami => ami.idrelation = selectedRelationId);
    }
    return null;
  }

  onSelect(ami: Ami) {
    this.selectedAmi = ami;
    this.response = null;
  }

}

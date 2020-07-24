import { Component, OnInit, Input } from '@angular/core';
import { Ami } from '../ami.type';
import { AmiState } from '../ami.etat.enum';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-ami-state-icon',
  templateUrl: './ami-state-icon.component.html',
  styleUrls: ['./ami-state-icon.component.css']
})
export class AmiStateIconComponent implements OnInit {

  @Input() amiState: AmiState;

  constructor() { }

  ngOnInit(): void {
  }

  getDescription(): string {

    let description: string = "";
    switch (this.amiState) {

      case AmiState.Arret: description = "Pas de trajet en cours."; break;
      case AmiState.EnChemin: description = "En chemin"; break;
      case AmiState.Pause: description = "Pause pendant le trajet"; break;
      case AmiState.NonConnu: description = "Etat de l'ami non connu."; break;

    }
    return description;
  }



}

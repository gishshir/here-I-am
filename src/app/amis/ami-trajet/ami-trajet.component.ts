import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Trajet, TrajetState } from 'src/app/trajets/trajet.type';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ToolsService } from 'src/app/common/tools.service';
import { TrajetService } from 'src/app/trajets/trajet.service';
import { Ami } from '../ami.type';

@Component({
  selector: 'app-ami-trajet',
  templateUrl: './ami-trajet.component.html',
  styleUrls: ['./ami-trajet.component.scss']
})
export class AmiTrajetComponent implements OnInit {

  @Input()
  set amiDetail(ami: Ami) {
    this.findDernierTrajet(ami);
  }
  @Output() eventMessage = new EventEmitter<Message>();

  amiTrajet: Trajet;

  constructor(private toolsService: ToolsService, private trajetService: TrajetService) {
  }

  getDescriptionTrajet(): string {

    let description = null;
    if (this.amiTrajet) {
      switch (this.amiTrajet.etat) {

        case TrajetState.started: description = "Mon ami est en chemin..."; break;
        case TrajetState.pausing: description = "Mon ami s'est arrêté..."; break;
        case TrajetState.ended: description = "Mon ami est arrivé."; break;

      }
    }

    return description;

  }

  findDernierTrajet(ami: Ami): void {

    this.amiTrajet = null;
    this.trajetService.chercherAmiDernierTrajet(ami.idrelation, {

      onGetTrajet: t => {
        if (t && t.id) {
          this.amiTrajet = t;
        }
      },
      onError: m => console.log(m)

    });

  }


  getStartDate(): string {

    return this.toolsService.formatDateAndTime(this.amiTrajet.starttime);
  }

  getEndDate(): string {

    if (this.amiTrajet.endtime < 0) {
      return "";
    }
    return this.toolsService.formatDateAndTime(this.amiTrajet.endtime);
  }

  getDuree(): string {
    if (this.amiTrajet.endtime < 0) {
      return this.toolsService.formatDureeFromNow(this.amiTrajet.starttime);
    }
    return this.toolsService.formatDuree(this.amiTrajet.starttime, this.amiTrajet.endtime);
  }

  ngOnInit(): void {
  }

}

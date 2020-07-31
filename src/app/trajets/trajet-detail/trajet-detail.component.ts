import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Trajet, TrajetState } from '../trajet.type';
import { ToolsService } from 'src/app/common/tools.service';
import { TrajetService } from '../trajet.service';
import { Message } from 'src/app/common/message.type';


@Component({
  selector: 'app-trajet-detail',
  templateUrl: './trajet-detail.component.html',
  styleUrls: ['./trajet-detail.component.css']
})
export class TrajetDetailComponent implements OnInit {

  @Input() trajetDetail: Trajet;
  @Output() eventChangeState = new EventEmitter<Trajet>();
  @Output() eventMessage = new EventEmitter<Message>();

  constructor(private toolsService: ToolsService, private trajetService: TrajetService) {
    console.log("trajet-detail-component constructeur...");
  }


  getStartDate(): string {

    return this.toolsService.formatDateAndTime(this.trajetDetail.starttime);
  }

  getEndDate(): string {

    if (this.trajetDetail.endtime < 0) {
      return "";
    }
    return this.toolsService.formatDateAndTime(this.trajetDetail.endtime);
  }



  private onChangeState(state: TrajetState): void {

    this.trajetService.changerStatusTrajet(this.trajetDetail.id, state, {

      onGetTrajet: (t: Trajet) => {
        this.trajetDetail = t;
        this.eventMessage.emit({ msg: "changement état réussi!", error: false });
        this.eventChangeState.emit(this.trajetDetail);
      },
      onError: (error: Message) => this.eventMessage.emit(error)
    });


  }


  getTrajetDescription() {

    let description = null;
    if (this.trajetDetail) {

      switch (this.trajetDetail.etat) {
        case TrajetState.started: description = "Je suis en chemin..."; break;
        case TrajetState.pausing: description = "Je suis arrêté(e)..."; break;
        case TrajetState.ended: description = "Je suis arrivé(e) à destination."; break;
      }
    }
    return description;
  }
  mettreEnPause(): void {
    this.onChangeState(TrajetState.pausing);
  }
  reprendreTrajet(): void {
    this.onChangeState(TrajetState.started);
  }
  arreterTrajet(): void {
    this.onChangeState(TrajetState.ended);
  }
  ngOnInit(): void {
  }

}

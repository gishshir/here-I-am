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

  getDuree(): string {
    if (this.trajetDetail.endtime < 0) {
      return this.toolsService.formatDureeFromNow(this.trajetDetail.starttime);
    }
    return this.toolsService.formatDuree(this.trajetDetail.starttime, this.trajetDetail.endtime);
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

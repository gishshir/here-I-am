import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Trajet } from '../trajet.type';
import { TrajetState } from '../trajet-etat.enum';
import { ToolsService } from 'src/app/common/tools.service';
import { TrajetService } from '../trajet.service';
import { TrajetDureeComponent } from '../trajet-duree/trajet-duree.component';

@Component({
  selector: 'app-trajet-detail',
  templateUrl: './trajet-detail.component.html',
  styleUrls: ['./trajet-detail.component.css']
})
export class TrajetDetailComponent implements OnInit {

  @Input() trajetDetail: Trajet;
  @Output() eventChangeState = new EventEmitter<TrajetState>();

  constructor(private toolsService: ToolsService, private trajetService: TrajetService) { }

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
    this.trajetDetail = this.trajetService.changerStatus(this.trajetDetail.id, state);
    this.eventChangeState.emit(state);

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
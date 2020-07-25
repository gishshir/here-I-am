import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RelationInfo, RelationState, RelationAction } from './relationinfo.type';
import { RelationService } from './relation.service';
import { Message } from 'src/app/common/message.type';
import { Ami } from '../ami.type';
import { Observer } from 'rxjs';
import { MessageHandler } from 'src/app/common/common.service';

@Component({
  selector: 'app-ami-relation',
  templateUrl: './relation.component.html',
  styleUrls: ['./relation.component.scss']
})
export class RelationComponent implements OnInit {

  _amiDetail: Ami;
  relationInfo: RelationInfo;


  constructor(private relationService: RelationService) { }

  @Output() eventMessage = new EventEmitter<Message>();

  @Input()
  set amiDetail(ami: Ami) {
    if (ami) {
      this._amiDetail = ami;
      this.getRelationInfo(ami.idrelation);
    }
  }
  get amiDetail(): Ami {
    return this._amiDetail;
  }

  ngOnInit(): void {
  }

  accepterInvitation() {
    console.log("accepterInvitation");
    this.relationService.updateActionRelation(this.relationInfo.id, RelationAction.acceptee, this.buildMessageHandler());
  }
  refuserInvitation() {
    console.log("refuserInvitation");
    this.relationService.updateActionRelation(this.relationInfo.id, RelationAction.refusee, this.buildMessageHandler());
  }

  private buildMessageHandler(): MessageHandler {

    return {
      onMessage: (m: Message) => {
        m.msg = "mise à jour de la relation effectuée!";
        this.eventMessage.emit(m);
        this.getRelationInfo(this.amiDetail.idrelation);
      },
      onError: (e: Message) => this.eventMessage.emit(e)
    }
  }

  getRelationStateColor() {

    switch (this.relationInfo.etat) {
      case RelationState.open: return "primary"
      case RelationState.pending: return "accent";
      case RelationState.closed: return "warn";
    }
  }

  displayRelationStateDescription() {

    if (this.relationInfo) {

      switch (this.relationInfo.etat) {
        case RelationState.open: return "relation validée"
        case RelationState.pending: return "en attente de validation";
        case RelationState.closed: return "relation refusée";
      }
    }
  }

  displayRelationActionDescription(moi: boolean) {

    let action: RelationAction = moi ? this.relationInfo.action : this.relationInfo.amiaction;
    let description: string = "";
    switch (action) {

      case RelationAction.none: description = "Pas de réponse de " + (moi ? "ma part." : "mon ami."); break;
      case RelationAction.invitation: description = "Invitation envoyée par " + (moi ? "moi" : "mon ami"); break;
      case RelationAction.acceptee: description = "Invitation acceptée par " + (moi ? "moi" : "mon ami"); break;
      case RelationAction.refusee: description = "Invitation refusée par " + (moi ? "moi" : "mon ami"); break;

    }
    return description;


  }

  getRelationInfo(idrelation: number) {

    this.relationService.getRelationInfoById(idrelation, {

      onGetRelationInfo: (relationInfo: RelationInfo) => this.relationInfo = relationInfo,
      onError: (error: Message) => this.eventMessage.emit(error)
    });

  }

}

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Ami, AmiState } from '../ami.type';
import { AmiService } from '../ami.service';
import { RelationService } from '../relation/relation.service';
import { Message } from '../../common/message.type';

@Component({
  selector: 'app-ami-detail',
  templateUrl: './ami-detail.component.html',
  styleUrls: ['./ami-detail.component.css']
})
export class AmiDetailComponent implements OnInit {

  _amiDetail: Ami;

  @Output() eventMessage = new EventEmitter<Message>();

  @Input()
  set amiDetail(ami: Ami) {
    this._amiDetail = ami;
  }

  get amiDetail(): Ami {
    return this._amiDetail;
  }

  constructor(private amiService: AmiService, private relationService: RelationService) { }

  ngOnInit(): void {
  }

  updateSuivreAmi() {

    // mettre à jour la bdd distante
    this.amiDetail.suivre = !this.amiDetail.suivre;

    this.amiService.updateSuivreAmi(this.amiDetail, {

      onMessage: (m: Message) => this.eventMessage.emit(m),
      onError: (e: Message) => {
        this.eventMessage.emit(e);
        this.amiDetail.suivre = !this.amiDetail.suivre;
      }
    });

  }
  updateNotifierAmi() {

    // mettre à jour la bdd distante

    this.amiService.updateNotifierAmi(this.amiDetail, !this.amiDetail.notifier, {

      onMessage: (m: Message) => this.eventMessage.emit(m),
      onError: (e: Message) => {
        this.eventMessage.emit(e);
        this.amiDetail.notifier = !this.amiDetail.notifier;
      }
    });

  }

}

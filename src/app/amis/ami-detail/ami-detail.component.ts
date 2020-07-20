import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Ami } from '../ami.type';
import { AmiState } from '../ami.etat.enum';
import { AmiService } from '../ami.service';
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

  constructor(private amiService: AmiService) { }

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

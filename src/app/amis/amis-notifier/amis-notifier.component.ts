import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Ami } from '../ami.type';
import { AmiService } from '../ami.service';
import { Message } from 'src/app/common/message.type';

@Component({
  selector: 'app-amis-notifier',
  templateUrl: './amis-notifier.component.html',
  styleUrls: ['./amis-notifier.component.css']
})
export class AmisNotifierComponent implements OnInit {

  @Input()
  listAmis: Ami[];

  @Output() eventMessage = new EventEmitter<Message>();

  constructor(private amiService: AmiService) {
    this.chercherListAmis();
  }

  ngOnInit(): void {
  }

  chercherListAmis(): Ami[] {

    if (this.listAmis == null) {
      console.log("chercherListAmis()");
      this.amiService.getListeAmis({
        onGetList: (l: Ami[]) => this.listAmis = l,
        onError: (e: Message) => console.log(e.msg)
      });
    }

    return this.listAmis;
  }

  // attention le click est déclenché avant la modification du model
  // a revoir: pas satisfaisant!!
  notifierAmi(ami: Ami) {

    ami.notifier = !ami.notifier;
    this.amiService.updateNotifierAmi(ami, {

      onMessage: (m: Message) => {
        this.eventMessage.emit(m);
        ami.notifier = !ami.notifier;
      },
      onError: (e: Message) => this.eventMessage.emit(e)

    });
  }

}

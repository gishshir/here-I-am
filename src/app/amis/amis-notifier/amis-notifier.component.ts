import { Component, OnInit, Input } from '@angular/core';
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
  amis: Ami[];

  constructor(private amiService: AmiService) { }

  ngOnInit(): void {
  }

  notifierAmi(ami: Ami) {

    ami.notifier = !ami.notifier;
    this.amiService.updateNotifierAmi(ami, {

      onMessage: (m: Message) => console.log(m.msg),
      onError: (e: Message) => console.log(e.msg)

    });
  }

}

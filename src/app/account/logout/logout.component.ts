import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../account.service';
import { Message } from 'src/app/common/message.type';

@Component({
  selector: 'app-logout',
  template: '',
  styleUrls: []
})
export class LogoutComponent implements OnInit {

  @Output() eventMessage = new EventEmitter<Message>();

  @Input()
  set logout(logout: boolean) {

    if (logout) {
      this.accountService.logout({
        onMessage: (m: Message) => this.eventMessage.emit(m),
        onError: (e: Message) => this.eventMessage.emit(e)
      });
    }
  }

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

}

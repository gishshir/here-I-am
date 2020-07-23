import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../account.service';
import { Message } from 'src/app/common/message.type';
import { NotificationService } from 'src/app/common/notification/notification.service';

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
        onMessage: (m: Message) => {
          this.eventMessage.emit(m);
          // lance un message pour l'ensemble de l'application
          this.notificationService.changeUser(null);
        },
        onError: (e: Message) => this.eventMessage.emit(e)
      });
    }
  }

  constructor(private accountService: AccountService, private notificationService: NotificationService) { }

  ngOnInit(): void {
  }

}

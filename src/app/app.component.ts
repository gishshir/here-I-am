import { Component } from '@angular/core';
import { Message } from './common/message.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'here-I-am';
  logout: boolean = false;
  response: Message;

  onLogout() {
    this.logout = true;
  }

  // reception d'un evenement de message
  onMessage(response: Message) {
    this.response = response;
  }
}

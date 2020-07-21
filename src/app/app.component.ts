import { Component } from '@angular/core';
import { Message } from './common/message.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'here-I-am';
  logout: boolean = false;
  response: Message;

  constructor(private route: Router) { }

  onLogout() {
    this.logout = true;

  }

  // reception d'un evenement de message
  onMessage(response: Message) {
    this.response = response;
    this.route.navigate(['/go-accueil']);
  }
}

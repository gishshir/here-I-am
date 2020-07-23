import { Component, OnInit } from '@angular/core';
import { Message } from './common/message.type';
import { Router } from '@angular/router';
import { AccountService } from './account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'here-I-am';
  logout: boolean = false;
  response: Message;

  constructor(private route: Router, private accountService: AccountService) { }
  ngOnInit(): void {
    console.log("App onInit()...");
    this.accountService.initUserLoggedIn();
  }

  onLogout() {
    this.logout = true;

  }

  // reception d'un evenement de message
  onMessage(response: Message) {
    this.response = response;
    this.route.navigate(['/go-accueil']);
  }
}

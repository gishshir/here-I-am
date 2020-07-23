import { Component, OnInit } from '@angular/core';
import { Message } from './common/message.type';
import { Router } from '@angular/router';
import { AccountService } from './account/account.service';
import { NotificationService } from './common/notification/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Où sont mes amis ?';
  logout: boolean = false;
  response: Message;

  constructor(private route: Router, private accountService: AccountService,
    private notificationService: NotificationService) {

    // abonnement
    this.notificationService.changeUser$.subscribe(
      (pseudo?: string) => this.mettreAJourBanniere(pseudo));

  }
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

  mettreAJourBanniere(pseudo?: string) {
    console.log("AppComponent#mettreAJourBanniere() " + pseudo);
    this.title = pseudo != null ?
      "Bienvenue " + pseudo + " !!!" : "Où sont mes amis ?";
  }
}

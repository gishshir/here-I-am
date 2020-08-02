import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

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
  loggedIn: boolean = false;
  response: Message;
  networkUsage: boolean = false;

  constructor(private route: Router, private accountService: AccountService,
    private notificationService: NotificationService, private router: Router) {

    console.log("production: " + environment.production);
    console.log("database: " + environment.database);
    console.log("apiUrl: " + environment.apiUrl);

    // abonnement au changement d'utilisateur
    this.notificationService.changeUser$.subscribe(
      (pseudo?: string) => this.mettreAJourBanniere(pseudo));

    // abonnement à l'usage intensif du réseau
    this.notificationService.networkUsage$.subscribe(
      (usage: boolean) => this.networkUsage = usage)

  }
  ngOnInit(): void {
    console.log("App onInit()...");
  }

  logout() {

    this.accountService.logout({
      onMessage: (m: Message) => {
        this.response = m;
        this.loggedIn = false;
        this.router.navigate(["/go-login"]);
      },
      onError: (e: Message) => this.response = e
    });
  }


  // reception d'un evenement de message
  onMessage(response: Message) {
    this.response = response;
    this.route.navigate(['/go-accueil']);
  }

  private mettreAJourBanniere(pseudo?: string) {
    console.log("AppComponent#mettreAJourBanniere() " + pseudo);
    this.title = pseudo != null ?
      "Bienvenue " + pseudo + " !!!" : "Où sont mes amis ?";
    this.loggedIn = pseudo != null;
  }


}

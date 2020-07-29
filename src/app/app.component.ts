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
  loggedIn: boolean = false;
  response: Message;

  constructor(private route: Router, private accountService: AccountService,
    private notificationService: NotificationService, private router: Router) {

    // abonnement
    this.notificationService.changeUser$.subscribe(
      (pseudo?: string) => this.mettreAJourBanniere(pseudo));

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

  mettreAJourBanniere(pseudo?: string) {
    console.log("AppComponent#mettreAJourBanniere() " + pseudo);
    this.title = pseudo != null ?
      "Bienvenue " + pseudo + " !!!" : "Où sont mes amis ?";
    this.loggedIn = pseudo != null;
  }
}

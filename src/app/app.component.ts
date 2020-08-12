import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

import { Message } from './common/message.type';
import { Router } from '@angular/router';
import { AccountService } from './account/account.service';
import { NotificationService } from './common/notification/notification.service';
import { Trajet, TrajetState } from './trajets/trajet.type';
import { GeolocationService } from './geolocation/geolocation.service';
import { TrajetService } from './trajets/trajet.service';
import { AppPosition } from './trajets/position.type';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogGeolocationComponent } from './geolocation/dialog-geolocation/dialog-geolocation.component';

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
  geolocationUsage: boolean;

  constructor(private trajetService: TrajetService, private geolocationService: GeolocationService, private route: Router, private accountService: AccountService,
    private notificationService: NotificationService, private router: Router, private dialog: MatDialog) {

    console.log("production: " + environment.production);
    console.log("database: " + environment.database);
    console.log("apiUrl: " + environment.apiUrl);

    // abonnement au changement d'utilisateur
    this.notificationService.changeUser$.subscribe(
      (pseudo?: string) => this.mettreAJourBanniere(pseudo));

    // abonnement à l'usage intensif du réseau
    this.notificationService.networkUsage$.subscribe(
      (usage: boolean) => this.networkUsage = usage);

    // abonnement à l'activation de la recherche de position
    this.notificationService.geolocation$.subscribe(
      (activate: boolean) => this.geolocationUsage = activate);

  }
  ngOnInit(): void {
    console.log("App onInit()...");
    this.trajetService.chercherDernierTrajet({
      onGetTrajet: (t: Trajet) => this.notificationService.changeMonTrajet(t),
      onError: (e: Message) => console.log(e.msg)
    });
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


  showDialogGeolocation(): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      titre: (this.geolocationUsage ? "Ma position actuelle" : "Dernière position connue")
    }

    const dialogRef = this.dialog.open(DialogGeolocationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => console.log("close dialog!")
    );
  }

}

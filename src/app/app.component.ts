import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../environments/environment';

import { Message } from './common/message.type';
import { Router } from '@angular/router';
import { AccountService } from './account/account.service';
import { NotificationService } from './common/notification/notification.service';
import { GeolocationService, GeolocationState } from './geolocation/geolocation.service';
import { TrajetService } from './trajets/trajet.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogGeolocationComponent } from './geolocation/dialog-geolocation/dialog-geolocation.component';
import { NetworkState } from './common/common.service';
import { User } from './account/user.type';
import { LoggerService } from './common/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'Où sont mes amis ?';
  loggedIn: boolean = false;
  response: Message;
  journalOn: boolean;

  // Network state
  private _networkState: NetworkState = NetworkState.stopped;
  getNetworkIconTitle() {
    return "network " + this._networkState;
  }
  getNetworkColor(): string {

    let color: string = null;
    switch (this._networkState) {

      case NetworkState.started:
      case NetworkState.success: color = "accent"; break;

      case NetworkState.stopped:
      case NetworkState.pending: color = "basic"; break;

      case NetworkState.error: color = "warn"; break;
    }
    return color;
  }

  // geolocation state
  private _geolocationState: GeolocationState = GeolocationState.stopped;

  getGeolocationIconTitle() {
    return "geolocation " + this._geolocationState;
  }
  isGeolocationActive(): boolean {
    return (this._geolocationState == GeolocationState.started) ||
      (this._geolocationState == GeolocationState.succes);
  }
  getGeolocationColor(): string {

    let color: string = null;
    switch (this._geolocationState) {

      case GeolocationState.started:
      case GeolocationState.succes: color = "accent"; break;

      case GeolocationState.stopped:
      case GeolocationState.pending: color = "basic"; break;

      case GeolocationState.error: color = "warn"; break;
    }
    return color;
  }


  constructor(private geolocationService: GeolocationService, private accountService: AccountService,
    notificationService: NotificationService, private router: Router, private dialog: MatDialog,
    logger: LoggerService) {

    console.log("production: " + environment.production);
    console.log("database: " + environment.database);
    console.log("apiUrl: " + environment.apiUrl);

    // initialisation
    this.journalOn = logger.isJournalActivated();

    // abonnement au changement d'utilisateur
    notificationService.changeUser$.subscribe(
      (user: User | null) => this.mettreAJourBanniere((user ? user.pseudo : null)));

    // abonnement à l'usage intensif du réseau
    notificationService.networkUsage$.subscribe(
      (state: NetworkState) => this._networkState = state);

    // abonnement à l'activation de la recherche de position
    notificationService.geolocation$.subscribe(
      (state: GeolocationState) => this._geolocationState = state);

    // abonnement aux messages
    notificationService.emitGeoMessage$.subscribe(
      (m: Message) => this.response = m);

    // s'inscrit aux notifications d'activation du journal
    notificationService.journal$.subscribe(
      (activate: boolean) => this.journalOn = activate);

  }
  ngOnDestroy(): void {
    this.geolocationService.ngOnDestroy();
  }
  ngOnInit(): void {
    console.log("App onInit()...");
  }

  logout() {


    this.accountService.logout({
      onMessage: (m: Message) => {
        this.response = m;
        //this.loggedIn = false;
        // this.router.navigate(["/go-login"]);
      },
      onError: (e: Message) => this.response = e
    });
  }


  // reception d'un evenement de message
  onMessage(response: Message) {
    this.response = response;
    //this.route.navigate(['/go-accueil']);
  }

  private mettreAJourBanniere(pseudo: string | null) {
    console.log("AppComponent#mettreAJourBanniere() " + pseudo);
    this.title = pseudo != null ?
      pseudo : "Où sont mes amis ?";
    this.loggedIn = pseudo != null;
  }


  showDialogGeolocation(): void {

    console.log("showDialogGeolocation(): geostate: " + this._geolocationState);
    let titreDial: string;

    // dans tous les cas .. on cherche une position
    this.geolocationService.forceCurrentPosition();

    titreDial = "Ma position actuelle";
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      titre: titreDial
    }

    const dialogRef = this.dialog.open(DialogGeolocationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => console.log("close dialog!")
    );
  }

}

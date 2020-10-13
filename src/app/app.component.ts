import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../environments/environment';

import { Message } from './common/message.type';
import { Router } from '@angular/router';
import { AccountService } from './account/account.service';
import { NotificationService } from './common/notification/notification.service';
import { Trajet, TrajetState } from './trajets/trajet.type';
import { GeolocationService, GeolocationState } from './geolocation/geolocation.service';
import { TrajetService } from './trajets/trajet.service';
import { AppPosition } from './trajets/position.type';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogGeolocationComponent } from './geolocation/dialog-geolocation/dialog-geolocation.component';
import { NetworkState } from './common/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'Où sont mes amis ?';
  loggedIn: boolean = false;
  response: Message;

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
      (state: NetworkState) => this._networkState = state);

    // abonnement à l'activation de la recherche de position
    this.notificationService.geolocation$.subscribe(
      (state: GeolocationState) => this._geolocationState = state);

    // abonnement aux messages
    this.notificationService.emitGeoMessage$.subscribe(
      (m: Message) => this.response = m);

  }
  ngOnDestroy(): void {
    this.geolocationService.ngOnDestroy();
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
    //this.route.navigate(['/go-accueil']);
  }

  private mettreAJourBanniere(pseudo?: string) {
    console.log("AppComponent#mettreAJourBanniere() " + pseudo);
    this.title = pseudo != null ?
      pseudo : "Où sont mes amis ?";
    this.loggedIn = pseudo != null;
  }


  showDialogGeolocation(): void {

    let titreDial: string;

    // au cas où .. on cherche une position
    if (this._geolocationState == GeolocationState.stopped ||
      this._geolocationState == GeolocationState.error) {
      let forcePosition: boolean = this.geolocationService.forceCurrentPosition();
      titreDial = forcePosition ? "Ma position actuelle" : "Dernière position connue";
    } else {
      titreDial = "Ma position actuelle";
    }

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

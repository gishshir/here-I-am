import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { User } from 'src/app/account/user.type';
import { Message } from 'src/app/common/message.type';
import { NotificationService } from 'src/app/common/notification/notification.service';
import { AlerteService } from '../alerte.service';
import { Alerte, CountAlerteInfo } from '../alerte.type';

@Component({
  selector: 'app-alerte-ami-menu',
  templateUrl: './alerte-ami-menu.component.html',
  styleUrls: ['./alerte-ami-menu.component.scss']
})
export class AlerteAmiMenuComponent implements OnInit, OnDestroy {

  alertesInfo: CountAlerteInfo;
  alertes: Array<Alerte>;

  @Input() lockscreen: boolean = false;
  @Output() eventMessage = new EventEmitter<Message>();

  // token sur le timer
  private timerid: number = -1;

  constructor(notificationService: NotificationService, private alerteService: AlerteService) {

    // abonnement au changement d'utilisateur
    notificationService.changeUser$.subscribe(
      (user: User | null) => {
        console.log("user: " + user);
        if (user != null) { this.startTimer(); }
      });

    // abonnement à la fermeture de la session
    notificationService.closedSession$.subscribe(
      (b: Boolean) => this.stopTimer());
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.stopTimer();
  }

  onMenuOpen(): void {
    console.log("onMenuOpen");
    this.listAlertes();
  }
  getIconColor(): string {

    let color: string = null;
    if (this.hasAlertes()) {
      if (this.alertesInfo.nbWarning > 0) {
        color = "warn";
      } else {
        color = "accent"
      }
    }
    return color;
  }

  validerAlertes(): void {

    let alertesEnCours: Array<Alerte> = this.alertes;

    this.stopTimer();

    this.alerteService.validerListAlertes(alertesEnCours, {
      onMessage: (m: Message) => {
        this.eventMessage.emit({ msg: 'validation des alertes réussie!', "error": false });
        this.startTimer();
      },
      onError: (e: Message) => console.log(e.msg)
    });


  }
  hasAlertes(): boolean {
    return this.alertesInfo == null ? false :
      this.alertesInfo.nbWarning + this.alertesInfo.nbInfo > 0;
  }

  private startTimer(): void {

    if (this.timerid == -1) {
      console.log("startTimer()");
      this.countAlertes();

      // rafraichir listes alertes toutes les 60s 
      this.timerid = window.setInterval(() => {

        this.countAlertes();
      }, 60000);

    }
  }
  private stopTimer(): void {
    console.log("stopTimer()");
    this.alertesInfo = null;
    this.alertes = null;

    if (this.timerid >= 0) {
      clearInterval(this.timerid);
      this.timerid = -1;
    }
  }
  private countAlertes(): void {

    this.alerteService.countCurrentAlertes({

      onGetInfo: (info: CountAlerteInfo) => this.alertesInfo = info,
      onError: (e: Message) => console.log(e.msg)
    });

  }

  private listAlertes(): void {

    this.alerteService.listCurrentAlertes({

      onGetList: (list: Array<Alerte>) => {
        this.alertes = list;

      },
      onError: (e: Message) => console.log(e.msg)

    });
  }



}

import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/common/notification/notification.service';
import { TrajetDetailComponent } from '../trajet-detail/trajet-detail.component';
import { TrajetService } from '../trajet.service';
import { Trajet, TrajetState } from '../trajet.type';

@Component({
  selector: 'app-trajet-home-icon',
  templateUrl: './trajet-home-icon.component.html',
  styleUrls: ['./trajet-home-icon.component.scss']
})
export class TrajetHomeIconComponent implements OnInit {

  trajetEtat: TrajetState;
  iconColor: string;
  trajetClass: string;
  iconName: string;

  @Input() lockscreen: boolean = true;

  constructor(notificationService: NotificationService, private trajetService: TrajetService) {

    //abonnement aux evenement de changement d'etat du trajet
    notificationService.monTrajet$.subscribe(
      (t: Trajet) => this.onChangeMonTrajet(t)
    );

    // deconnection
    notificationService.closedSession$.subscribe(
      (b) => this.init()
    )
  }

  ngOnInit(): void {
    this.init();
  }

  private init(): void {

    this.trajetEtat = TrajetState.ended;
    this.iconColor = 'basic';
    this.iconName = 'home';
  }

  private onChangeMonTrajet(t: Trajet): void {

    if (t) {

      this.iconName = 'home';

      switch (t.etat) {

        case TrajetState.ended:
          this.iconColor = 'basic'; this.trajetClass = 'home-icon'; break;
        case TrajetState.pausing:
          this.iconColor = 'basic'; this.trajetClass = 'home-icon';
          this.iconName = this.trajetService.getIconName(t.mean); break;
        case TrajetState.started:
          this.iconColor = 'accent'; this.trajetClass = 'home-icon-up-down';
          this.iconName = this.trajetService.getIconName(t.mean); break;
      }
    }
  }

}

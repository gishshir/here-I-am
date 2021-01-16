import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../common/notification/notification.service';

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.scss']
})
export class LockscreenComponent implements OnInit {

  constructor(private router: Router, private notificationService: NotificationService) { }

  ngOnInit(): void {
    console.log("lock screen...");
    this.notificationService.activateLockScreen(true);
  }

  unlock($event): void {
    this.notificationService.activateLockScreen(false);
    this.router.navigate(["/go-accueil"]);

  }

}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogUnlockComponent } from './dialog-unlock/dialog-unlock.component';
import { NotificationService } from '../common/notification/notification.service';

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.scss']
})
export class LockscreenComponent implements OnInit {


  constructor(private router: Router, private notificationService: NotificationService,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    console.log("lock screen...");
    this.notificationService.activateLockScreen(true);
  }

  onclick($event): void {
    this.notificationService.emitMessage({ msg: "Click droit pour déverrouiller!", error: false });
  }

  confirmUnlock($event): void {

    const dialogRef = this.dialog.open(DialogUnlockComponent, null);
    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.notificationService.activateLockScreen(false);
          this.router.navigate(["/go-accueil"]);
        }
      }
    );
  }

}

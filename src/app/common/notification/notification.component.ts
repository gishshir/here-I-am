import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../message.type';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notification',
  template: '',
  styleUrls: []
})
export class NotificationComponent implements OnInit {


  @Input()
  set message(message: Message) {
    if (message) {
      this.openSnackBar(message);
    }
  }

  constructor(public snackBar: MatSnackBar) { }

  openSnackBar(message: Message) {
    let style = message.error ? "notification-error-container" : "notification-container";
    this.snackBar.open(message.msg, null, {
      duration: 2000,
      panelClass: [style]
    });
  }

  ngOnInit(): void {
  }

}


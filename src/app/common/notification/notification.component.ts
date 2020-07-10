import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../message.type';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  @Input() message: Message;

  constructor() { }

  ngOnInit(): void {
  }

}

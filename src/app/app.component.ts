import { Component, OnInit } from '@angular/core';
import { Message } from './common/message.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  response: Message;

  onResponse(message: Message) {
    this.response = message;
  }

  ngOnInit(): void {
    console.log("App onInit()...");
  }


}

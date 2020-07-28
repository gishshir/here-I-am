import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {
    console.log("notification service constructor");
  }

  coucou() {
    console.log("coucou");
  }

  //--------------------------------------------------
  // Observable string source
  private changeUserSource = new Subject<string>();
  // observable string streams
  changeUser$ = this.changeUserSource.asObservable();

  // services message commands
  changeUser(pseudo?: string) {
    console.log("NotificationService#changeUser() " + pseudo);
    this.changeUserSource.next(pseudo);
  }
  //--------------------------------------------------


  //--------------------------------------------------
  //Observable string source
  private closedSessionSource = new Subject<boolean>();
  // observable string streams
  closedSession$ = this.closedSessionSource.asObservable();

  informClosedSession(value: boolean) {
    console.log("NotificationService#informClosedSession() " + value);
    this.closedSessionSource.next(value);
  }
  //--------------------------------------------------



}

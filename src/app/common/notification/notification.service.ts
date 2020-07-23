import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // Observable string source
  private changeUserSource = new Subject<string>();

  // observable string streams
  changeUser$ = this.changeUserSource.asObservable();

  // services message commands
  changeUser(pseudo?: string) {
    console.log("NotificationService#changeUser() " + pseudo);
    this.changeUserSource.next(pseudo);
  }

  constructor() { }
}

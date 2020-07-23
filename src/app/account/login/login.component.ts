import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AccountService } from '../account.service';
import { Message } from 'src/app/common/message.type';
import { User } from '../user.type';
import { NotificationService } from '../../common/notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  response: Message;

  authenticationFormGroup: FormGroup = this.fb.group(

    {
      loginControl: ['', [Validators.required, Validators.minLength(4)]],
      passwordControl: ['', [Validators.required, Validators.minLength(4)]]
    }

  );

  get loginControl(): FormControl {
    return this.authenticationFormGroup.get("loginControl") as FormControl;
  }
  get passwordControl(): FormControl {
    return this.authenticationFormGroup.get("passwordControl") as FormControl;
  }
  constructor(private fb: FormBuilder, private accountService: AccountService,
    private notificationService: NotificationService) { }

  onSubmit() {
    console.log("onSubmit()");

    this.accountService.login(this.loginControl.value, this.passwordControl.value, {
      onGetUser: (user: User) => {
        this.response = { msg: "bonjour " + user.pseudo + " !", error: false };
        // lance un message pour l'ensemble de l'application
        this.notificationService.changeUser(user.pseudo);
        this.accountService.redirectAfterLogin();
      },
      onError: (e: Message) => this.response = e
    });

  }

  ngOnInit(): void {
  }

}

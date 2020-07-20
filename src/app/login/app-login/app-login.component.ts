import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoginService } from '../login.service';
import { Message } from 'src/app/common/message.type';
import { User } from '../user.type';

@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.scss']
})
export class AppLoginComponent implements OnInit {

  response: Message;

  authenticationFormGroup: FormGroup = this.fb.group(

    {
      loginControl: ['', Validators.required],
      passwordControl: ['', Validators.required]
    }

  );

  get loginControl(): FormControl {
    return this.authenticationFormGroup.get("loginControl") as FormControl;
  }
  get passwordControl(): FormControl {
    return this.authenticationFormGroup.get("passwordControl") as FormControl;
  }
  constructor(private fb: FormBuilder, private loginService: LoginService) { }

  onSubmit() {
    console.log("onSubmit() : " + this.authenticationFormGroup.value);


    this.loginService.login(this.loginControl.value, this.passwordControl.value, {
      onGetUser: (user: User) => this.response = {
        msg: "bonjour " + user.pseudo + " !",
        error: false
      },
      onError: (e: Message) => this.response = e
    });

  }

  ngOnInit(): void {
  }

}

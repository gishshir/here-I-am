import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AccountService } from '../account.service';
import { Message } from 'src/app/common/message.type';
import { User } from '../user.type';

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
  constructor(private fb: FormBuilder, private accountService: AccountService) { }

  onSubmit() {
    console.log("onSubmit() : " + this.authenticationFormGroup.value);


    this.accountService.login(this.loginControl.value, this.passwordControl.value, {
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

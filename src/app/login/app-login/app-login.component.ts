import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.scss']
})
export class AppLoginComponent implements OnInit {

  authenticationFormGroup: FormGroup = this.fb.group(

    {
      loginControl: ['', Validators.required],
      pwdControl: ['', Validators.required]
    }

  );



  constructor(private fb: FormBuilder) { }

  onSubmit() {
    console.log("onSubmit() : " + this.authenticationFormGroup.value);
  }

  ngOnInit(): void {
  }

}

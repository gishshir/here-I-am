import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, ValidationErrors } from '@angular/forms';
import { AccountService } from '../account.service';
import { Message } from 'src/app/common/message.type';
import { User } from '../user.type';



@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss']
})
export class CreateAccountComponent implements OnInit {

  response: Message;

  createAccountFormGroup: FormGroup = this.fb.group(

    {
      loginControl: ['', [Validators.required, Validators.minLength(4)]],
      password1Control: ['', [Validators.required, Validators.minLength(4)]],
      password2Control: ['', [Validators.required, Validators.minLength(4)]],
      pseudoControl: ['', [Validators.required, Validators.minLength(6)]],
      emailControl: ['', [Validators.required, Validators.email]]
    },
    {
      validator: MustMatch('password1Control', 'password2Control')
    }

  );

  get loginControl(): FormControl {
    return this.createAccountFormGroup.get("loginControl") as FormControl;
  }
  get password1Control(): FormControl {
    return this.createAccountFormGroup.get("password1Control") as FormControl;
  }
  get password2Control(): FormControl {
    return this.createAccountFormGroup.get("password2Control") as FormControl;
  }
  get pseudoControl(): FormControl {
    return this.createAccountFormGroup.get("pseudoControl") as FormControl;
  }
  get emailControl(): FormControl {
    return this.createAccountFormGroup.get("emailControl") as FormControl;
  }
  constructor(private fb: FormBuilder, private accountService: AccountService) { }

  ngOnInit(): void {
  }
  onSubmit() {
    console.log("onSubmit() : " + this.createAccountFormGroup.value);
  }

}

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}

import { Component, OnInit, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, ValidationErrors, AsyncValidator, AbstractControl } from '@angular/forms';
import { AccountService } from '../account.service';
import { Message } from 'src/app/common/message.type';
import { User } from '../user.type';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { AccountInfo } from '../accountinfo.type';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { DialogCreateAccountSuccessComponent } from './dialog-success.component';



@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss']
})
export class CreateAccountComponent implements OnInit {

  response: Message;


  createAccountFormGroup: FormGroup = this.fb.group(

    {
      loginControl: ['', [Validators.required, Validators.minLength(4)], [new UniqueLoginValidator(this.accountService)]],
      password1Control: ['', [Validators.required, Validators.minLength(4)]],
      password2Control: ['', [Validators.required, Validators.minLength(4)]],
      pseudoControl: ['', [Validators.required, Validators.minLength(6)], [new UniquePseudoValidator(this.accountService)]],
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
  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {

  }
  onSubmit() {
    console.log("onSubmit() : " + this.createAccountFormGroup.value);

    let user: User = this.accountService.buildUser(this.loginControl.value, this.password1Control.value, this.pseudoControl.value);
    let email: string = this.emailControl.value;
    this.accountService.creerCompte(user, email, {

      onGetAccountInfo: (a: AccountInfo) => {
        this.response = { msg: "Le compte a été créé avec succès!", error: false };
        delay(1000);
        this.dialogContinuer(user);
      },
      onError: (e: Message) => this.response = e
    });

  }

  dialogContinuer(user: User): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      login: user.login,
      pseudo: user.pseudo
    };

    const dialogRef = this.dialog.open(DialogCreateAccountSuccessComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.router.navigate(["/go-login"]);
        }
      }
    );
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

// asynchrone validateur : controle si le login existe déjà en bdd
@Injectable({ providedIn: 'root' })
export class UniqueLoginValidator implements AsyncValidator {
  constructor(private accountService: AccountService) { }

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.accountService.isLoginTaken(ctrl.value).pipe(
      map(isTaken => (isTaken ? { uniqueLogin: true } : null)),
      catchError(() => of(null))
    );
  }
}

@Injectable({ providedIn: 'root' })
export class UniquePseudoValidator implements AsyncValidator {
  constructor(private accountService: AccountService) { }

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.accountService.isPseudoTaken(ctrl.value).pipe(
      map(isTaken => (isTaken ? { uniquePseudo: true } : null)),
      catchError(() => of(null))
    );
  }
}

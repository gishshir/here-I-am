import { Component, Injectable, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidator, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { Message } from 'src/app/common/message.type';
import { AccountService } from '../account.service';
import { AccountInfo } from '../account.type';
import { DialogCreateAccountSuccessComponent } from '../creation/dialog-success.component';
import { CredentialsDto, User } from '../user.type';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  accountInfo: AccountInfo;
  changerMotPasse: boolean = false;

  response: Message;



  modifyAccountFormGroup: FormGroup = this.fb.group(

    {
      loginControl: ['', []],
      oldPasswordControl: ['', [Validators.required, Validators.minLength(4)]],
      newPasswordControl: ['', [new RequiredIfVisible(this), Validators.minLength(4)]],
      password2Control: ['', [Validators.minLength(4)]],
      pseudoControl: ['', [Validators.required, Validators.minLength(6)], [new UniquePseudoValidator(this.accountService)]],
      emailControl: ['', [Validators.required, Validators.email], [new UniqueEmailValidator(this.accountService)]]
    },
    {
      validator: MustMatch('newPasswordControl', 'password2Control')
    }

  );

  get loginControl(): FormControl {
    return this.modifyAccountFormGroup.get("loginControl") as FormControl;
  }
  get oldPasswordControl(): FormControl {
    return this.modifyAccountFormGroup.get("oldPasswordControl") as FormControl;
  }
  get newPasswordControl(): FormControl {
    return this.modifyAccountFormGroup.get("newPasswordControl") as FormControl;
  }
  get password2Control(): FormControl {
    return this.modifyAccountFormGroup.get("password2Control") as FormControl;
  }
  get pseudoControl(): FormControl {
    return this.modifyAccountFormGroup.get("pseudoControl") as FormControl;
  }
  get emailControl(): FormControl {
    return this.modifyAccountFormGroup.get("emailControl") as FormControl;
  }


  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {

    this.enablePasswordChangeControle(false);
    this.accountService.getAccountInfo({
      onError: (e: Message) => console.log(e.msg),
      onGetAccountInfo: (a: AccountInfo) => this.onGetAccountInfo(a)

    }
    )
  }

  onGetAccountInfo(accountInfo: AccountInfo): void {

    this.accountInfo = accountInfo;
    this.loginControl.setValue(this.accountInfo.utilisateur.login);
    this.emailControl.setValue(this.accountInfo.account.email);
    this.pseudoControl.setValue(this.accountInfo.utilisateur.pseudo);
  }
  onModeChangeMotPasse($event: MatSlideToggleChange) {
    this.changerMotPasse = $event.checked;

    if (!this.changerMotPasse) {
      this.newPasswordControl.reset();
      this.password2Control.reset();
      this.enablePasswordChangeControle(false);

      this.modifyAccountFormGroup.updateValueAndValidity();
      console.log("valide: " + this.modifyAccountFormGroup.valid);
    } else {
      this.enablePasswordChangeControle(true);
    }
  }

  private enablePasswordChangeControle(enable: boolean): void {

    if (enable) {
      this.newPasswordControl.enable();
      this.password2Control.enable();
    } else {
      this.newPasswordControl.disable();
      this.password2Control.disable();
    }

  }

  onSubmit() {
    console.log("onSubmit() : " + this.modifyAccountFormGroup.value);

    let credentials: CredentialsDto = this.accountService.buildCredentials(this.loginControl.value, this.newPasswordControl.value);
    let email: string = this.emailControl.value;
    let pseudo: string = this.pseudoControl.value;

    // this.accountService.creerCompte(credentials, pseudo, email, {

    //   onGetAccountInfo: (a: AccountInfo) => {
    //     this.response = { msg: "Le compte a été modifié avec succès!", error: false };
    //     delay(1000);
    //     let user: User = this.accountService.buildUser(credentials.login, pseudo);
    //     this.dialogContinuer(user);
    //   },
    //   onError: (e: Message) => this.response = e
    // });

  }

  annuler(): void {
    this.router.navigate(["/go-login"]);
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

@Injectable({ providedIn: 'root' })
export class RequiredIfVisible implements AsyncValidator {

  constructor(private component: AccountComponent) { }

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (this.component.changerMotPasse && !ctrl.value) {
      return of({ requiredIfVisible: true });
    }
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class UniqueEmailValidator implements AsyncValidator {
  constructor(private accountService: AccountService) { }

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.accountService.isEmailTaken(ctrl.value).pipe(
      map(isTaken => (isTaken ? { uniqueEmail: true } : null)),
      catchError(() => of(null))
    );
  }

}

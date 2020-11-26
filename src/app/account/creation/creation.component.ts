import { Component, OnInit, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, ValidationErrors, AsyncValidator, AbstractControl } from '@angular/forms';
import { AccountService, MustMatch, UniqueEmailValidator, UniqueLoginValidator, UniquePseudoValidator } from '../account.service';
import { Message } from 'src/app/common/message.type';
import { CredentialsDto, User } from '../user.type';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { AccountInfo } from '../account.type';
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
      emailControl: ['', [Validators.required, Validators.email], [new UniqueEmailValidator(this.accountService)]]
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

    let credentials: CredentialsDto = this.accountService.buildCredentials(this.loginControl.value, this.password1Control.value);
    let email: string = this.emailControl.value;
    let pseudo: string = this.pseudoControl.value;
    this.accountService.creerCompte(credentials, pseudo, email, {

      onGetAccountInfo: (a: AccountInfo) => {
        this.response = { msg: "Le compte a été créé avec succès!", error: false };
        delay(1000);
        let user: User = this.accountService.buildUser(credentials.login, pseudo);
        this.dialogContinuer(user);
      },
      onError: (e: Message) => this.response = e
    });

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





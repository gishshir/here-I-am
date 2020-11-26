import { Component, Injectable, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidator, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Message } from 'src/app/common/message.type';
import { NotificationService } from 'src/app/common/notification/notification.service';
import { AccountService, MustMatch, UniqueEmailValidator, UniquePseudoValidator } from '../account.service';
import { AccountInfo } from '../account.type';
import { DialogCreateAccountSuccessComponent } from '../dialog/dialog-success.component';
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
    public dialog: MatDialog, private notificationService: NotificationService) { }

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

  hasModification(): boolean {

    let modification: boolean = false;

    if (this.pseudoControl.dirty || this.emailControl.dirty) {
      modification = true;
    }

    if (!modification && this.changerMotPasse) {
      if (this.newPasswordControl.dirty) {
        modification = true;
      }
    }

    return modification;
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

    let credentials: CredentialsDto = this.accountService.buildCredentials(this.loginControl.value, this.oldPasswordControl.value);
    let email: string = this.emailControl.value;
    let pseudo: string = this.pseudoControl.value;
    let newpassword: string | null = this.newPasswordControl.dirty && this.changerMotPasse ? this.newPasswordControl.value : null;

    this.accountService.modifierCompte(credentials, pseudo, email, newpassword, {

      onGetAccountInfo: (a: AccountInfo) => {
        this.response = { msg: "Le compte a été modifié avec succès!", error: false };
        delay(1000);
        let user: User = a.utilisateur;
        this.dialogContinuer(user);
        this.notificationService.changeUser(user);
      },
      onError: (e: Message) => this.response = e
    });

  }

  annuler(): void {
    this.router.navigate(["/go-accueil"]);
  }

  private logout() {
    this.accountService.logout({
      onMessage: (m: Message) => this.response = m,
      onError: (e: Message) => this.response = e
    });
  }

  dialogContinuer(user: User): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      login: user.login,
      pseudo: user.pseudo,
      title: "Modification du compte réussie!",
      message: "Le compte a été modifié avec succès!",
      redirectmessage: "Vous allez être redirigé vers la page " +
        (this.changerMotPasse ? "de login." : "d'accueil.")
    };

    const dialogRef = this.dialog.open(DialogCreateAccountSuccessComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          if (this.changerMotPasse) {
            this.logout();
          } else {
            this.router.navigate(["/go-accueil"]);
          }

        }
      }
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





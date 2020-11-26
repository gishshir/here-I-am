import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountRoutingModule } from './account-routing.module';

import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './creation/creation.component';
import { DialogCreateAccountSuccessComponent } from './dialog/dialog-success.component';
import { AccountComponent } from './modify/account.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AccountRoutingModule
    ],
    exports: [

    ],
    declarations: [
        LoginComponent, CreateAccountComponent, DialogCreateAccountSuccessComponent, AccountComponent
    ]
})
export class AccountModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountRoutingModule } from './account-routing.module';

import { LogoutComponent } from './logout/logout.component';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './creation/creation.component';
import { DialogCreateAccountSuccessComponent } from './creation/dialog-success.component';


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
        LogoutComponent
    ],
    declarations: [
        LoginComponent, LogoutComponent, CreateAccountComponent, DialogCreateAccountSuccessComponent
    ]
})
export class AccountModule { }
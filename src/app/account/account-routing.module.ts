import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './creation/creation.component';
import { AccountComponent } from './modify/account.component';
import { AppGuardGuard } from '../app-guard.guard';

const accountRoutes: Routes = [
    { path: 'go-login', component: LoginComponent },
    { path: 'go-account-create', component: CreateAccountComponent },
    { path: 'go-account-modify', component: AccountComponent, canActivate: [AppGuardGuard] }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(accountRoutes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
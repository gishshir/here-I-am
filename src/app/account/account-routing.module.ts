import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './creation/creation.component';

const accountRoutes: Routes = [
    { path: 'go-login', component: LoginComponent },
    { path: 'go-account-create', component: CreateAccountComponent },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(accountRoutes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
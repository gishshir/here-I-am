import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccueilComponent } from './accueil/accueil.component';
import { AmisComponent } from './amis/amis.component';
import { TrajetsComponent } from './trajets/trajets.component';
import { StartingComponent } from './starting/starting.component';
import { AppGuardGuard } from './app-guard.guard';
import { StartingGuard } from "./starting/starting.guard";

const routes: Routes = [

  { path: 'go-accueil', component: AccueilComponent },
  { path: 'go-amis', component: AmisComponent, canActivate: [AppGuardGuard] },
  { path: 'go-trajets', component: TrajetsComponent, canActivate: [AppGuardGuard] },
  { path: 'go-starting', component: StartingComponent, canActivate: [AppGuardGuard, StartingGuard] },
  { path: '', redirectTo: '/go-accueil', pathMatch: 'full' },
  { path: '**', component: AccueilComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

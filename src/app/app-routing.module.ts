import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccueilComponent } from './accueil/accueil.component';
import { AmisComponent } from './amis/amis.component';
import { TrajetsComponent } from './trajets/trajets.component';
import { StartingComponent } from './starting/starting.component';
import { AppGuardGuard } from './app-guard.guard';
import { StartingGuard } from "./starting/starting.guard";
import { JournalComponent } from './journal/journal.component';
import { OptionsComponent } from './options/options.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';

const routes: Routes = [

  { path: 'go-lockscreen', component: LockscreenComponent, canActivate: [AppGuardGuard] },
  { path: 'go-accueil', component: AccueilComponent, canActivate: [AppGuardGuard] },
  { path: 'go-amis', component: AmisComponent, canActivate: [AppGuardGuard] },
  { path: 'go-trajets', component: TrajetsComponent, canActivate: [AppGuardGuard] },
  { path: 'go-starting', component: StartingComponent, canActivate: [AppGuardGuard, StartingGuard] },
  { path: 'go-journal', component: JournalComponent, canActivate: [AppGuardGuard] },
  { path: 'go-options', component: OptionsComponent, canActivate: [AppGuardGuard] },
  { path: '', redirectTo: '/go-accueil', pathMatch: 'full' },
  { path: '**', component: AccueilComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

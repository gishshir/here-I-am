import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccueilComponent } from './accueil/accueil.component';
import { AmisComponent } from './amis/amis.component';
import { TrajetsComponent } from './trajets/trajets.component';
import { StartingComponent } from './starting/starting.component';

const routes: Routes = [

  {path: 'go-accueil', component: AccueilComponent},
  {path: 'go-amis', component: AmisComponent},
  {path: 'go-trajets', component: TrajetsComponent},
  {path: 'go-starting', component: StartingComponent},
  { path: '',   redirectTo: '/go-accueil', pathMatch: 'full' },
  { path: '**', component: AccueilComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

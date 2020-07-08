import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AmisComponent } from './amis/amis.component';
import { TrajetsComponent } from './trajets/trajets.component';
import { StartingComponent } from './starting/starting.component';
import { AccueilComponent } from './accueil/accueil.component';
import { AmiDetailComponent } from './amis/ami-detail/ami-detail.component';
import { AmiStateIconComponent } from './amis/ami-state-icon/ami-state-icon.component';
import { AmiSuiviIconComponent } from './amis/ami-suivi-icon/ami-suivi-icon.component';
import { TrajetStateIconComponent } from './trajets/trajet-state-icon/trajet-state-icon.component';
import { TrajetDetailComponent } from './trajets/trajet-detail/trajet-detail.component';
import { TrajetDureeComponent } from './trajets/trajet-duree/trajet-duree.component';

@NgModule({
  declarations: [
    AppComponent,
    AmisComponent,
    TrajetsComponent,
    StartingComponent,
    AccueilComponent,
    AmiDetailComponent,
    AmiStateIconComponent,
    AmiSuiviIconComponent,
    TrajetStateIconComponent,
    TrajetDetailComponent,
    TrajetDureeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

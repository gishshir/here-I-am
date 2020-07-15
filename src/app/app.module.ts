import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';

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
import { TrajetMeansIconComponent } from './trajets/trajet-means-icon/trajet-means-icon.component';
import { CommonComponent } from './common/common.component';
import { NotificationComponent } from './common/notification/notification.component';
import { AmisNotifierComponent } from './amis/amis-notifier/amis-notifier.component';

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
    TrajetDureeComponent,
    TrajetMeansIconComponent,
    CommonComponent,
    NotificationComponent,
    AmisNotifierComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

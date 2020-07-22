import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

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
import { DialogDeleteTrajetComponent } from './trajets/dialog-delete/dialog-delete.component';
import { LoginComponent } from './account/login/login.component';
import { HttpRequestInterceptor } from './common/http-request-interceptor';
import { LogoutComponent } from './account/logout/logout.component';
import { CreateAccountComponent } from './account/creation/creation.component';


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
    AmisNotifierComponent,
    DialogDeleteTrajetComponent,
    LoginComponent,
    LogoutComponent,
    CreateAccountComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [
    // Http Interceptor(s) -  adds with Client Credentials
    [
      { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
    ],
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogDeleteTrajetComponent]
})
export class AppModule { }

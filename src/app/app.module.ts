import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountModule } from './account/account.module';

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
import { DialogDeleteTrajetComponent } from './trajets/dialog-delete/dialog-delete-trajet.component';
import { HttpRequestInterceptor } from './common/http-request-interceptor';
import { AmisPipe } from './amis/amis.pipe';
import { RelationComponent } from './amis/relation/relation.component';
import { ActionRelComponent } from './amis/relation/action-rel/action-rel.component';
import { DialogInvitationComponent } from './amis/dialog-invitation/dialog-invitation.component';
import { DialogConfirmInvitationComponent } from './amis/dialog-invitation/confirm/dialog-confirm-invitation.component';
import { DialogDeleteRelationComponent } from './amis/relation/dialog-delete/dialog-delete-relation.component';
import { AmiTrajetComponent } from './amis/ami-trajet/ami-trajet.component';
import { TrajetCommonComponent } from './trajets/trajet-common/trajet-common.component';
import { GeolocationComponent } from './trajets/geolocation/geolocation.component';
import { AmiGeolocationComponent } from './amis/ami-geolocation/ami-geolocation.component';




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
    AmisPipe,
    RelationComponent,
    ActionRelComponent,
    DialogInvitationComponent,
    DialogConfirmInvitationComponent,
    DialogDeleteRelationComponent,
    AmiTrajetComponent,
    TrajetCommonComponent,
    GeolocationComponent,
    AmiGeolocationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    AccountModule,
    AppRoutingModule
  ],
  providers: [
    [
      // Http Interceptor(s) -  adds with Client Credentials
      { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
    ],
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogDeleteTrajetComponent]
})
export class AppModule { }

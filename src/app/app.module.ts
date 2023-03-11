import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule, EffectSources } from '@ngrx/effects';

import { BrowserModule } from '@angular/platform-browser';
import { DemoLandingComponent } from './demo-landing/demo-landing.component';
import { usersReducer } from './state/reducer/users-reducers';
import { UsersEffect } from './state/effect/users.effects';
import { addressReducer } from './state/reducer/address-reducer';

@NgModule({
  declarations: [
    AppComponent,
    DemoLandingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EffectsModule.forRoot([UsersEffect]),
    StoreModule.forRoot({
      user: usersReducer,
      address: addressReducer
    }),
    StoreDevtoolsModule.instrument({
      // logOnly: environment.production, // Restrict extension to log-only mode
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { BrowserModule } from '@angular/platform-browser';
import { DemoLandingComponent } from './demo-landing/demo-landing.component';
import { usersReducer } from './state/reducer/users-reducers';
import { addressReducer } from './state/reducer/address-reducer';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { RegisterComponent } from './register/register.component';
import { LocationComponent } from './location/location.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'swiper/angular';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { JobPostComponent } from './job-post/job-post.component';
import { EmptyFieldPipePipe } from './pipe/empty-field-pipe.pipe';
import { EmptyFieldPipe } from './pipe/empty-field.pipe';
import { ProvinceFilterPipe } from './pipe/province-filter.pipe';
import { SalaryTypePipe } from './pipe/salary-type.pipe';
import { WorkExperiencePipe } from './pipe/work-experience.pipe';
import { GoogleMapsModule } from '@angular/google-maps';
import { JobPostSmallCardComponent } from './job-post-small-card/job-post-small-card.component';


@NgModule({
  declarations: [
    AppComponent,
    DemoLandingComponent,
    ConfirmEmailComponent,
    RegisterComponent,
    LocationComponent,
    LandingPageComponent,
    JobPostComponent,
    EmptyFieldPipePipe,
    EmptyFieldPipe,
    SalaryTypePipe,
    WorkExperiencePipe,
    ProvinceFilterPipe,
    JobPostSmallCardComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    GoogleMapsModule,
    ReactiveFormsModule,
    SwiperModule,
    StoreModule.forRoot({
      user: usersReducer,
      address: addressReducer
    }),
    StoreDevtoolsModule.instrument({
      // logOnly: environment.production, // Restrict extension to log-only mode
    }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(()=>getAuth()),
    provideStorage(()=>getStorage()),
  ],
  providers: [],  // add this line
  bootstrap: [AppComponent]
})
export class AppModule { }
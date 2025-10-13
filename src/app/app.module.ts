import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { BrowserModule } from '@angular/platform-browser';
import { DemoLandingComponent } from './demo-landing/demo-landing.component';
import { usersReducer } from './state/reducer/users-reducers';
import { addressReducer } from './state/reducer/address-reducer';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { RegisterComponent } from './register/register.component';
import { LocationComponent } from './location/location.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { JobPostComponent } from './job-post/job-post.component';
import { EmptyFieldPipePipe } from './pipe/empty-field-pipe.pipe';
import { EmptyFieldPipe } from './pipe/empty-field.pipe';
import { ProvinceFilterPipe } from './pipe/province-filter.pipe';
import { SalaryTypePipe } from './pipe/salary-type.pipe';
import { WorkExperiencePipe } from './pipe/work-experience.pipe';
import { GoogleMapsModule } from '@angular/google-maps';
import { JobPostSmallCardComponent } from './job-post-small-card/job-post-small-card.component';
import { HttpClientModule } from '@angular/common/http';
import { operatorReducer } from './pharmacist/state/reducers/operator-reducers';
import { jobPostReducer } from './pharmacist/state/reducers/job-post-reducers';
import { CookieService } from 'ngx-cookie-service';
import { SwiperDirective } from './directive/swiper.directive.directive';

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
    SwiperDirective,
    EmptyFieldPipe,
    SalaryTypePipe,
    WorkExperiencePipe,
    ProvinceFilterPipe,
    JobPostSmallCardComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    GoogleMapsModule,
    MatAutocompleteModule,
    ShareButtonsModule.withConfig({
      debug: true,
    }),
    ShareIconsModule,
    MatInputModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot({
      user: usersReducer,
      address: addressReducer,
      operator: operatorReducer,
      jobpost: jobPostReducer,
    }),
    StoreDevtoolsModule.instrument({
      // logOnly: environment.production, // Restrict extension to log-only mode
    }),
    // AngularFireModule.initializeApp(environment.firebase),
    // AngularFirestoreModule,
    // AngularFireAuthModule,
    // AngularFireStorageModule,
  ],
  providers: [LandingPageComponent, CookieService], // add this line
  bootstrap: [AppComponent],
})
export class AppModule {}

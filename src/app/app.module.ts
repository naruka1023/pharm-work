import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { Store, StoreModule } from '@ngrx/store';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { DemoLandingComponent } from './demo-landing/demo-landing.component';
import { usersReducer } from './state/reducer/users-reducers';
import { addressReducer } from './state/reducer/address-reducer';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { LocationComponent } from './location/location.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LandingPageRealComponent } from './landing-page/landing-page.component';
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
import { SwiperBrowserModule } from './dependency-module/swiper-browser.module';
import { SharedModuleModule } from './shared-module/shared-module.module';
import { recentlySeenReducer } from './pharmacist/state/reducers/recently-seen-reducers';
import { notificationsReducer } from './pharmacist/state/reducers/notifications.reducers.';
import { INITIAL_STATE, rootReducers } from './state/store/app-store';
import { JobPostService } from './pharmacist/service/job-post.service';

export function serverPrefetchFactory(jobService: JobPostService) {
  return async () => {
    // fetch and dispatch inside Angular DI
    console.log('dispatch');
    jobService.dispatchJobs();
    // if your service dispatches internally, you don't need to do anything else
  };
}

@NgModule({
  declarations: [
    AppComponent,
    DemoLandingComponent,
    // ConfirmEmailComponent,
    LocationComponent,
    LandingPageRealComponent,
    JobPostComponent,
    EmptyFieldPipePipe,
    // SwiperDirective,
    EmptyFieldPipe,
    // WorkExperiencePipe,
    // ProvinceFilterPipe,
    SalaryTypePipe,
    JobPostSmallCardComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    GoogleMapsModule,
    MatAutocompleteModule,
    ShareButtonsModule.withConfig({
      debug: true,
    }),
    ShareIconsModule,
    SharedModuleModule,
    MatInputModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forRoot(rootReducers),
    StoreDevtoolsModule.instrument({
      // logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  providers: [
    LandingPageRealComponent,
    CookieService,
    {
      provide: INITIAL_STATE,
      useValue: {}, // placeholder; SSR will override this
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [JobPostService],
      useFactory: serverPrefetchFactory,
    },
  ], // add this line
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}

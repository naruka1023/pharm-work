import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwiperModule } from 'swiper/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './page/landing-page/landing-page.component';
import { SwiperModuleComponent } from './common/swiper-module/swiper-module.component';
import { JobPostDetailsComponent } from './page/job-post-details/job-post-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    SwiperModuleComponent,
    JobPostDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    SwiperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

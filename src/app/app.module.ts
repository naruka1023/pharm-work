import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwiperModule } from 'swiper/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './page/landing-page/landing-page.component';
import { SwiperModuleComponent } from './common/swiper-module/swiper-module.component';
import { JobPostDetailsComponent } from './page/job-post-details/job-post-details.component';
import { JobPostNormalCardComponent } from './common/job-post-normal-card/job-post-normal-card.component';
import { JobPostSmallCardComponent } from './common/job-post-small-card/job-post-small-card.component';
import { JobsListComponent } from './page/jobs-list/jobs-list.component';
import { FilterComponent } from './common/filter/filter.component';
import { FilterListComponent } from './common/filter-list/filter-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    SwiperModuleComponent,
    JobPostDetailsComponent,
    JobPostNormalCardComponent,
    JobPostSmallCardComponent,
    JobsListComponent,
    FilterComponent,
    FilterListComponent,
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

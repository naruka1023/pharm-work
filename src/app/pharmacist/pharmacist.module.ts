import { NgModule } from '@angular/core';
import { LandingPageComponent } from './landing-page.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PharmaAppRoutingModule } from './pharma-app-routing.module';
import { FilterListComponent } from './common/filter-list/filter-list.component';
import { FilterComponent } from './common/filter/filter.component';
import { JobPostSmallCardComponent } from './common/job-post-small-card/job-post-small-card.component';
import { ProfileheaderComponent } from './common/profileheader/profileheader.component';
import { SwiperModuleComponent } from './common/swiper-module/swiper-module.component';
import { JobPostDetailsComponent } from './page/job-post-details/job-post-details.component';
import { JobsListComponent } from './page/jobs-list/jobs-list.component';
import { LoginPageComponent } from './page/login-page/login-page.component';
import { PharmaHomeComponent } from './page/pharma-home/pharma-home.component';
import { BookmarkComponent } from './page/pharma-profile/bookmark/bookmark.component';
import { InnerProfileComponent } from './page/pharma-profile/inner-profile/inner-profile.component';
import { PharmaProfileComponent } from './page/pharma-profile/pharma-profile.component';
import { RecentlySeenJobsComponent } from './page/pharma-profile/recently-seen-jobs/recently-seen-jobs.component';
import { RegisterComponent } from './page/register/register.component';
import { JobPostNormalCardComponent } from './common/job-post-normal-card/job-post-normal-card.component';
import { jobPostReducer } from './state/reducers/job-post-reducers';
import { JobPostEffects } from './state/effects/job-post.effects';
import { recentlySeenReducer } from './state/reducers/recently-seen-reducers';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwiperModule } from 'swiper/angular';
import { CommonModule } from '@angular/common';
import { RequestJobsComponent } from './page/pharma-profile/request-jobs/request-jobs.component';
import { LocationComponent } from './common/location/location.component';
import { OperatorPageComponent } from './page/operator-page/operator-page.component';
import { FollowersPageComponent } from './page/followers-page/followers-page.component';
import { OperatorNormalCardComponent } from './common/operator-normal-card/operator-normal-card.component';
import { pharmaProfileReducer } from './state/reducers/pharma-profile.reducers';




@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    SwiperModule,
    PharmaAppRoutingModule,
    EffectsModule.forFeature([JobPostEffects]),
    StoreModule.forFeature('jobpost', jobPostReducer),
    StoreModule.forFeature('recentlySeen', recentlySeenReducer),
    StoreModule.forFeature('pharmaProfile', pharmaProfileReducer),
  ],
  declarations: [
    LandingPageComponent,
    PharmaHomeComponent,
    SwiperModuleComponent,
    JobPostDetailsComponent,
    JobPostNormalCardComponent,
    JobPostSmallCardComponent,
    JobsListComponent,
    FilterComponent,
    FilterListComponent,
    LoginPageComponent,
    RegisterComponent,
    PharmaProfileComponent,
    ProfileheaderComponent,
    InnerProfileComponent,
    BookmarkComponent,
    RecentlySeenJobsComponent,
    RequestJobsComponent,
    LocationComponent,
    OperatorPageComponent,
    FollowersPageComponent,
    OperatorNormalCardComponent,
  ],
  bootstrap:[LandingPageComponent]
})
export class PharmacistModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwiperModule } from 'swiper/angular';
import { ProfileHeaderComponent } from './common/profileheader/profileheader.component';
import { LandingPageComponent } from './landing-page.component';
import { OperatorAppRoutingModule } from './operator-app-routing';
import { OperatorProfileComponent } from './page/operator-profile/operator-profile.component';
import { InnerProfileComponent } from './page/operator-profile/inner-profile/inner-profile.component';
import { AllJobsPostsComponent } from './page/operator-profile/all-jobs-posts/all-jobs-posts.component';
import { AddNewJobComponent } from './page/add-new-job/add-new-job.component';
import { OperatorHomeComponent } from './page/operator-home/operator-home.component';
import { LocationSelectorComponent } from './common/location-selector/location-selector.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FlatpickrModule } from 'angularx-flatpickr';
import { JobPostEffects } from './state/effects/job-post.effects';
import { jobPostReducer } from './state/reducer/job-post.reducer';
import { JobPostNormalCardComponent } from './common/job-post-normal-card/job-post-normal-card.component';
import { JobPostDetailsComponent } from './page/job-post-details/job-post-details.component';




@NgModule({
  declarations: [
    LandingPageComponent,
    OperatorProfileComponent,
    ProfileHeaderComponent,
    InnerProfileComponent,
    AllJobsPostsComponent,
    JobPostDetailsComponent,
    AddNewJobComponent,
    JobPostNormalCardComponent,
    OperatorHomeComponent,
    LocationSelectorComponent
  ],
  imports: [
    CommonModule,
    CKEditorModule,
    RouterModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    FlatpickrModule.forRoot(),
    SwiperModule,
    EffectsModule.forFeature([JobPostEffects]),
    StoreModule.forFeature("createdJobs", jobPostReducer),
    OperatorAppRoutingModule,
  ],
  bootstrap:[LandingPageComponent]
})
export class OperatorModule { }

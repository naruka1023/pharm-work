import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { LandingPageComponent } from './landing-page.component';
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
import { JobPostNormalCardComponent } from './common/job-post-normal-card/job-post-normal-card.component';
import { jobPostReducer } from './state/reducers/job-post-reducers';
import { FlatpickrModule } from 'angularx-flatpickr';
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
import { ChatConfirmComponent } from './common/chat-confirm/chat-confirm.component';
import { operatorReducer } from './state/reducers/operator-reducers';
import { urgentJobsReducer } from './state/reducers/urgent-jobs-reducers';
import { RegisterJobsComponent } from './page/pharma-profile/register-jobs/register-jobs.component';
import { UrgentJobHistoryComponent } from './page/pharma-profile/urgent-job-history/urgent-job-history.component';
import { UrgentJobsComponent } from './page/pharma-profile/urgent-jobs/urgent-jobs.component';
import { RequestViewComponent } from './page/pharma-profile/request-view/request-view.component';
import { UrgentJobsPageComponent } from './page/pharma-profile/urgent-jobs-page/urgent-jobs-page.component';
import { RegisterComponent } from './page/register/register.component';
import { MainProfileComponent } from './page/pharma-profile/main-profile/main-profile.component';
import { PrivateProfileComponent } from './page/pharma-profile/private-profile/private-profile.component';
import { PreferredJobsComponent } from './page/pharma-profile/preferred-jobs/preferred-jobs.component';
import { requestViewReducer } from './state/reducers/request-view.reducers';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { GoogleMapsModule } from '@angular/google-maps';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { OperatorSmallCardComponent } from './common/operator-small-card/operator-small-card.component';
import { EmptyFieldPipePipe } from './pipe/empty-field-pipe.pipe';
import { EmptyFieldPipe } from './pipe/empty-field.pipe';
import { SalaryTypePipe } from './pipe/salary-type.pipe';
import { WorkExperiencePipe } from './pipe/work-experience.pipe';
import { FooterComponent } from './common/footer/footer.component';
import { ProvinceFilterPipe } from './pipe/province-filter.pipe';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GooglePlaceModule } from "@yuvarajv/ngx-google-places-autocomplete";
import { NotificationsComponent } from './common/notifications/notifications.component';
import { notificationsReducer } from './state/reducers/notifications.reducers.';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    GooglePlaceModule,
    ShareButtonsModule,
    ShareIconsModule,
    FontAwesomeModule,
    CKEditorModule,
    FormsModule,
    SwiperModule,
    PharmaAppRoutingModule,
    FlatpickrModule.forRoot(),
    StoreModule.forFeature('recentlySeen', recentlySeenReducer),
    StoreModule.forFeature('pharmaProfile', pharmaProfileReducer),
    StoreModule.forFeature('jobpost', jobPostReducer),
    StoreModule.forFeature('operator', operatorReducer),
    StoreModule.forFeature('urgentJobs', urgentJobsReducer),
    StoreModule.forFeature('requestView', requestViewReducer),
    StoreModule.forFeature('notifications', notificationsReducer),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [InfiniteScrollModule],
  declarations: [
    LandingPageComponent,
    PharmaHomeComponent,
    SwiperModuleComponent,
    FooterComponent,
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
    ChatConfirmComponent,
    RegisterJobsComponent,
    RequestViewComponent,
    UrgentJobHistoryComponent,
    UrgentJobsComponent,
    UrgentJobsPageComponent,
    MainProfileComponent,
    PrivateProfileComponent,
    PreferredJobsComponent,
    OperatorSmallCardComponent,
    EmptyFieldPipePipe,
    EmptyFieldPipe,
    SalaryTypePipe,
    WorkExperiencePipe,
    ProvinceFilterPipe,
    NotificationsComponent
  ],
  providers:[PharmaProfileComponent, LandingPageComponent, RegisterJobsComponent],
  bootstrap:[LandingPageComponent]
})
export class PharmacistModule { }


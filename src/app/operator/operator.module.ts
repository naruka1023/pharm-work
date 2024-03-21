import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { jobPostReducer } from './state/reducer/job-post.reducer';
import { JobPostNormalCardComponent } from './common/job-post-normal-card/job-post-normal-card.component';
import { JobPostDetailsComponent } from './page/job-post-details/job-post-details.component';
import { EditJobComponent } from './page/edit-job/edit-job.component';
import { RequestJobComponent } from './page/operator-profile/request-job/request-job.component';
import { OperatorPageComponent } from './page/operator-page/operator-page.component';
import { usersReducer } from './state/reducer/user.reducer';
import { UserByTypeComponent } from './common/user-by-type/user-by-type.component';
import { SmallUserCardComponent } from './common/small-user-card/small-user-card.component';
import { UserListComponent } from './page/user-list/user-list.component';
import { NormalUserCardComponent } from './common/normal-user-card/normal-user-card.component';
import { FavoritesComponent } from './page/operator-profile/favorites/favorites.component';
import { recentlySeenReducer } from './state/reducer/recently-seen.reducers';
import { PharmaUserProfilePageComponent } from './page/pharma-user-profile-page/pharma-user-profile-page.component';
import { RecentlySeenUsersComponent } from './page/recently-seen-users/recently-seen-users.component';
import { operatorProfileReducer } from './state/reducer/operator-profile.reducers';
import { jobRequestReducer } from './state/reducer/job-request.reducer';
import { UrgentJobsComponent } from './page/operator-profile/urgent-jobs/urgent-jobs.component';
import { UrgentJobsPageComponent } from './page/operator-profile/urgent-jobs-page/urgent-jobs-page.component';
import { UrgentJobsHistoryComponent } from './page/operator-profile/urgent-jobs-history/urgent-jobs-history.component';
import { requestViewReducer } from './state/reducer/request-view.reducer';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { GoogleMapsModule } from '@angular/google-maps';
import { GooglePlaceModule } from "@yuvarajv/ngx-google-places-autocomplete";
import { EmptyFieldPipe } from './pipe/empty-field.pipe';
import { ProvinceFilterPipe } from './pipe/province-filter.pipe';
import { SalaryTypePipe } from './pipe/salary-type.pipe';
import { WorkExperiencePipe } from './pipe/work-experience.pipe';
import { FooterComponent } from './common/footer/footer.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { notificationsReducer } from './state/reducer/notifications.reducers.';
import { NotificationsComponent } from './common/notifications/notifications.component';
import { CheckoutComponent } from './page/checkout/checkout.component';




@NgModule({
  declarations: [
    LandingPageComponent,
    OperatorProfileComponent,
    ProfileHeaderComponent,
    InnerProfileComponent,
    AllJobsPostsComponent,
    JobPostDetailsComponent,
    AddNewJobComponent,
    FooterComponent,
    JobPostNormalCardComponent,
    OperatorHomeComponent,
    LocationSelectorComponent,
    EditJobComponent,
    RequestJobComponent,
    OperatorPageComponent,
    UserByTypeComponent,
    SmallUserCardComponent,
    UserListComponent,
    NormalUserCardComponent,
    FavoritesComponent,
    PharmaUserProfilePageComponent,
    RecentlySeenUsersComponent,
    UrgentJobsComponent,
    UrgentJobsPageComponent,
    UrgentJobsHistoryComponent,
    EmptyFieldPipe,
    ProvinceFilterPipe,
    SalaryTypePipe,
    WorkExperiencePipe,
    NotificationsComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    CKEditorModule,
    RouterModule,
    GoogleMapsModule,
    GooglePlaceModule,
    InfiniteScrollModule,
    ShareButtonsModule,
    ShareIconsModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    FlatpickrModule.forRoot(),
    SwiperModule,
    StoreModule.forFeature("createdJobs", jobPostReducer),
    StoreModule.forFeature("requestedJobs", jobRequestReducer),
    StoreModule.forFeature("users", usersReducer),
    StoreModule.forFeature("recentlySeen", recentlySeenReducer),
    StoreModule.forFeature("requestView", requestViewReducer),
    StoreModule.forFeature("operatorProfile", operatorProfileReducer),
    StoreModule.forFeature('notifications', notificationsReducer),
    OperatorAppRoutingModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [RequestJobComponent, OperatorProfileComponent, AllJobsPostsComponent],
  exports: [InfiniteScrollModule],
  bootstrap:[LandingPageComponent, CheckoutComponent]
})
export class OperatorModule { }

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { OperatorDetailsComponent } from './buy/operator-details/operator-details.component';
import { BannerMenuComponent } from './buy/banner-menu/banner-menu.component';
import { ContactDetailsComponent } from './buy/contact-details/contact-details.component';
import { BannerSellPageComponent } from './buy/banner-sell-page/banner-sell-page.component';
import { SocialMediaSellPageComponent } from './buy/social-media-sell-page/social-media-sell-page.component';
import { RegisterComponent } from '../pharmacist/page/register/register.component';
import { LoginPageComponent } from '../pharmacist/page/login-page/login-page.component';
import { LandingPageComponent } from '../pharmacist/landing-page.component';
import { PharmaHomeComponent } from '../pharmacist/page/pharma-home/pharma-home.component';
import { SwiperModuleComponent } from '../pharmacist/common/swiper-module/swiper-module.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationsComponent } from '../pharmacist/common/notifications/notifications.component';
import { RouterModule } from '@angular/router';
import { PharmaProfileComponent } from '../pharmacist/page/pharma-profile/pharma-profile.component';
import { RegisterJobsComponent } from '../pharmacist/page/pharma-profile/register-jobs/register-jobs.component';
import { StoreModule } from '@ngrx/store';
import { notificationsReducer } from '../pharmacist/state/reducers/notifications.reducers.';
import { recentlySeenReducer } from '../pharmacist/state/reducers/recently-seen-reducers';
import { JobPostSmallCardComponent } from '../pharmacist/common/job-post-small-card/job-post-small-card.component';
import { SalaryTypePipe } from '../pharmacist/pipe/salary-type.pipe';
import { JobPostNormalCardComponent } from '../pharmacist/common/job-post-normal-card/job-post-normal-card.component';
import { JobPostDetailsComponent } from '../pharmacist/page/job-post-details/job-post-details.component';
import { EmptyFieldPipe } from '../pharmacist/pipe/empty-field.pipe';
import { EmptyFieldPipePipe } from '../pharmacist/pipe/empty-field-pipe.pipe';
import { PipeModule } from './pipe.module';
import { OperatorSmallCardComponent } from '../pharmacist/common/operator-small-card/operator-small-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ContactDetailsComponent,
    PipeModule,
    BannerMenuComponent,
    StoreModule.forFeature('recentlySeen', recentlySeenReducer),
    StoreModule.forFeature('notifications', notificationsReducer),
  ],
  declarations: [
    OperatorDetailsComponent,
    BannerSellPageComponent,
    NotificationsComponent,
    PharmaHomeComponent,
    PharmaProfileComponent,
    JobPostSmallCardComponent,
    OperatorSmallCardComponent,
    SwiperModuleComponent,
    // JobPostDetailsComponent,
    // JobPostNormalCardComponent,
    RegisterComponent,
    // SalaryTypePipe,
    // EmptyFieldPipePipe,
    // EmptyFieldPipe,
    RegisterJobsComponent,
    LoginPageComponent,
    LandingPageComponent,
    SocialMediaSellPageComponent,
  ],
  providers: [
    NotificationsComponent,
    PharmaProfileComponent,
    RegisterJobsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [OperatorDetailsComponent],
})
export class SharedModuleModule {}

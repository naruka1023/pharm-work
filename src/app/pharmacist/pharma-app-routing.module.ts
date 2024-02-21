import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InnerProfileGuard } from './guards/inner-profile.guard';
import { ProfilePharmaGuard } from './guards/profile-pharma.guard';
import { UrgentJobsGuard } from './guards/urgent-jobs.guard';
import { LandingPageComponent } from './landing-page.component';
import { FollowersPageComponent } from './page/followers-page/followers-page.component';
import { JobPostDetailsComponent } from './page/job-post-details/job-post-details.component';
import { JobsListComponent } from './page/jobs-list/jobs-list.component';
import { LoginPageComponent } from './page/login-page/login-page.component';
import { OperatorPageComponent } from './page/operator-page/operator-page.component';
import { PharmaHomeComponent } from './page/pharma-home/pharma-home.component';
import { BookmarkComponent } from './page/pharma-profile/bookmark/bookmark.component';
import { InnerProfileComponent } from './page/pharma-profile/inner-profile/inner-profile.component';
import { PharmaProfileComponent } from './page/pharma-profile/pharma-profile.component';
import { RecentlySeenJobsComponent } from './page/pharma-profile/recently-seen-jobs/recently-seen-jobs.component';
import { RequestJobsComponent } from './page/pharma-profile/request-jobs/request-jobs.component';
import { RequestViewComponent } from './page/pharma-profile/request-view/request-view.component';
import { UrgentJobHistoryComponent } from './page/pharma-profile/urgent-job-history/urgent-job-history.component';
import { UrgentJobsComponent } from './page/pharma-profile/urgent-jobs/urgent-jobs.component';
import { RegisterJobsComponent } from './page/pharma-profile/register-jobs/register-jobs.component';
import { RegisterComponent } from './page/register/register.component';
import { UrgentJobsPageComponent } from './page/pharma-profile/urgent-jobs-page/urgent-jobs-page.component';
import { MainProfileComponent } from './page/pharma-profile/main-profile/main-profile.component';
import { PrivateProfileComponent } from './page/pharma-profile/private-profile/private-profile.component';
import { PreferredJobsComponent } from './page/pharma-profile/preferred-jobs/preferred-jobs.component';
import { OperatorPageGuard } from './guards/operator-page.guard';
import { NotificationsComponent } from './common/notifications/notifications.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent,children:[
    { path: '', component: PharmaHomeComponent},
    { path: 'notifications', component: NotificationsComponent},
    { path: 'job-post', component: JobPostDetailsComponent, canDeactivate:[UrgentJobsGuard]},
    { path: 'jobs-list', component: JobsListComponent},
    { path: 'operator-page', component: OperatorPageComponent,canActivate:[OperatorPageGuard]},
    { path: 'profile-pharma', component: PharmaProfileComponent,canActivate:[InnerProfileGuard], children:[
      { path: '',   redirectTo: 'inner-profile', pathMatch: 'full' },
      {path:'inner-profile', component:InnerProfileComponent, canDeactivate:[ProfilePharmaGuard], children: [
        {path: '', redirectTo: 'private-profile', pathMatch: 'full'},
        {path:'main-profile', component:MainProfileComponent},
        {path:'private-profile', component:PrivateProfileComponent},
        {path:'preferred-jobs', component:PreferredJobsComponent},
        {path:'urgent-jobs', component:UrgentJobsComponent},
      ]},
      {path:'bookmark', component:BookmarkComponent},
      { path: 'followers', component: FollowersPageComponent},
      {path:'recently-seen-job', component:RecentlySeenJobsComponent},
      {path:'register-jobs', component:RegisterJobsComponent, children: [
        { path: '',   redirectTo: 'request-jobs', pathMatch: 'prefix' },
        {path:'request-jobs', component:RequestJobsComponent},
        {path:'request-views', component:RequestViewComponent}
      ]},
    ]},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmaAppRoutingModule { }

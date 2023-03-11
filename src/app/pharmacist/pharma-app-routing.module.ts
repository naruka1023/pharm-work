import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InnerProfileGuard } from './guards/inner-profile.guard';
import { OperatorPageGuard } from './guards/operator-page.guard';
import { ProfilePharmaGuard } from './guards/profile-pharma.guard';
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
import { RegisterComponent } from './page/register/register.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent,children:[
    { path: '', component: PharmaHomeComponent},
    { path: 'job-post', component: JobPostDetailsComponent},
    { path: 'jobs-list', component: JobsListComponent},
    { path: 'login', component: LoginPageComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'operator-page', component: OperatorPageComponent, canDeactivate:[OperatorPageGuard]},
    { path: 'profile-pharma', component: PharmaProfileComponent,canActivate:[InnerProfileGuard], children:[
      { path: '',   redirectTo: 'inner-profile', pathMatch: 'full' },
      {path:'inner-profile', component:InnerProfileComponent, canDeactivate:[ProfilePharmaGuard]},
      {path:'bookmark', component:BookmarkComponent},
      { path: 'followers', component: FollowersPageComponent},
      {path:'recently-seen-job', component:RecentlySeenJobsComponent},
      {path:'request-jobs', component:RequestJobsComponent}
    ]},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmaAppRoutingModule { }

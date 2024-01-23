import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InnerProfileGuard } from './guards/inner-profile.guard';
import { ProfileOperatorGuard } from './guards/profile-operator.guard';
import { LandingPageComponent } from './landing-page.component';
import { AddNewJobComponent } from './page/add-new-job/add-new-job.component';
import { EditJobComponent } from './page/edit-job/edit-job.component';
import { JobPostDetailsComponent } from './page/job-post-details/job-post-details.component';
import { OperatorHomeComponent } from './page/operator-home/operator-home.component';
import { AllJobsPostsComponent } from './page/operator-profile/all-jobs-posts/all-jobs-posts.component';
import { FavoritesComponent } from './page/operator-profile/favorites/favorites.component';
import { InnerProfileComponent } from './page/operator-profile/inner-profile/inner-profile.component';
import { OperatorProfileComponent } from './page/operator-profile/operator-profile.component';
import { RequestJobComponent } from './page/operator-profile/request-job/request-job.component';
import { PharmaUserProfilePageComponent } from './page/pharma-user-profile-page/pharma-user-profile-page.component';
import { RecentlySeenUsersComponent } from './page/recently-seen-users/recently-seen-users.component';
import { UserListComponent } from './page/user-list/user-list.component';
import { UrgentJobsComponent } from './page/operator-profile/urgent-jobs/urgent-jobs.component';
import { UrgentJobsPageComponent } from './page/operator-profile/urgent-jobs-page/urgent-jobs-page.component';
import { UrgentJobsHistoryComponent } from './page/operator-profile/urgent-jobs-history/urgent-jobs-history.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent,children:[
    { path: '', component: OperatorHomeComponent},
    { path: 'add-new-jobs', component: AddNewJobComponent},
    { path: 'add-new-jobs', component: AddNewJobComponent},
    { path: 'edit-jobs', component: EditJobComponent},
    { path: 'job-detail', component: JobPostDetailsComponent},
    { path: 'pharma-user-profile', component: PharmaUserProfilePageComponent},
    { path: 'profile-operator', component: OperatorProfileComponent, canActivate:[ProfileOperatorGuard],children:[
      { path: '',   redirectTo: 'inner-profile', pathMatch: 'full' },
      { path: 'inner-profile', component: InnerProfileComponent ,canDeactivate:[InnerProfileGuard]},
      { path: 'all-jobs-posts', component: AllJobsPostsComponent},
      { path: 'request-jobs', component: RequestJobComponent},
      {path:'urgent-jobs', component:UrgentJobsComponent, children: [
        { path: '',   redirectTo: 'urgent-jobs-page', pathMatch: 'full' },
        {path:'urgent-jobs-page', component:UrgentJobsPageComponent},
        {path:'urgent-jobs-history', component:UrgentJobsHistoryComponent}
      ]},
      { path: 'recently-seen-users', component: RecentlySeenUsersComponent},
      { path: 'favorites', component: FavoritesComponent},
    ]},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperatorAppRoutingModule { }

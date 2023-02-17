import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileOperatorGuard } from './guards/profile-operator.guard';
import { LandingPageComponent } from './landing-page.component';
import { AddNewJobComponent } from './page/add-new-job/add-new-job.component';
import { EditJobComponent } from './page/edit-job/edit-job.component';
import { JobPostDetailsComponent } from './page/job-post-details/job-post-details.component';
import { OperatorHomeComponent } from './page/operator-home/operator-home.component';
import { AllJobsPostsComponent } from './page/operator-profile/all-jobs-posts/all-jobs-posts.component';
import { InnerProfileComponent } from './page/operator-profile/inner-profile/inner-profile.component';
import { OperatorProfileComponent } from './page/operator-profile/operator-profile.component';
import { RequestJobComponent } from './page/operator-profile/request-job/request-job.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent,children:[
    { path: '', component: OperatorHomeComponent},
    { path: 'add-new-jobs', component: AddNewJobComponent},
    { path: 'add-new-jobs', component: AddNewJobComponent},
    { path: 'edit-jobs', component: EditJobComponent},
    { path: 'job-detail', component: JobPostDetailsComponent},
    { path: 'profile-operator', component: OperatorProfileComponent, children:[
      { path: '',   redirectTo: 'inner-profile', pathMatch: 'full' },
      { path: 'inner-profile', component: InnerProfileComponent ,canDeactivate:[ProfileOperatorGuard]},
      { path: 'all-jobs-posts', component: AllJobsPostsComponent},
      { path: 'request-jobs', component: RequestJobComponent},
    ]},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperatorAppRoutingModule { }

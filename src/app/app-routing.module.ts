import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobListGuard } from './guards/jobList.guard';
import { JobPostDetailsComponent } from './page/job-post-details/job-post-details.component';
import { JobsListComponent } from './page/jobs-list/jobs-list.component';
import { LandingPageComponent } from './page/landing-page/landing-page.component';
import { LoginPageComponent } from './page/login-page/login-page.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'job-post', component: JobPostDetailsComponent },
  { path: 'jobs-list', component: JobsListComponent},
  { path: 'login', component: LoginPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

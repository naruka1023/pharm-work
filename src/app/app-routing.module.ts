import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobPostDetailsComponent } from './page/job-post-details/job-post-details.component';
import { LandingPageComponent } from './page/landing-page/landing-page.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'job-post', component: JobPostDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

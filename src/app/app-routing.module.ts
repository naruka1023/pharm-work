import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoLandingComponent } from './demo-landing/demo-landing.component';
import { LandingPageComponent as PharmaLanding } from './pharmacist/landing-page.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { RegisterComponent } from './register/register.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { JobPostComponent } from './job-post/job-post.component';

const routes: Routes = [
  { path: '', component: DemoLandingComponent},
  { path: 'landing', component: LandingPageComponent, children:[
    {path:'register', component:RegisterComponent},
  ]},
  { path: 'confirm', component: ConfirmEmailComponent},
  {
    path: 'pharma',
    loadChildren: () =>
      import('./pharmacist/pharmacist.module').then((m) => m.PharmacistModule),
  },
  {
    path: 'operator',
    loadChildren: () =>
      import('./operator/operator.module').then((m) => m.OperatorModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', initialNavigation: 'enabledBlocking' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

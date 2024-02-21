import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoLandingComponent } from './demo-landing/demo-landing.component';
import { LandingPageComponent as PharmaLanding } from './pharmacist/landing-page.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { RegisterComponent } from './register/register.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { JobPostComponent } from './job-post/job-post.component';
import { OperatorPageComponent } from './pharmacist/page/operator-page/operator-page.component';

const routes: Routes = [
  { path: 'notifications', component: DemoLandingComponent},
  { path: '', component: DemoLandingComponent},
  { path: 'landing', children:[
    {path:'register', component:RegisterComponent},
    {path:'operator-page/:operatorUID', component:OperatorPageComponent},
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

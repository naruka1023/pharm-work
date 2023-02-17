import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoLandingComponent } from './demo-landing/demo-landing.component';
import { LandingPageComponent as PharmaLanding } from './pharmacist/landing-page.component';

const routes: Routes = [
  { path: '', component: DemoLandingComponent},
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
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

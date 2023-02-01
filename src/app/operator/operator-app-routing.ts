import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';
import { OperatorProfileComponent } from './page/operator-profile/operator-profile.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent,children:[
    { path: '', component: OperatorProfileComponent},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperatorAppRoutingModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwiperModule } from 'swiper/angular';
import { LandingPageComponent } from './landing-page.component';
import { OperatorAppRoutingModule } from './operator-app-routing';
import { OperatorProfileComponent } from './page/operator-profile/operator-profile.component';



@NgModule({
  declarations: [
    LandingPageComponent,
    OperatorProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    SwiperModule,
    OperatorAppRoutingModule,
  ],
  bootstrap:[LandingPageComponent]
})
export class OperatorModule { }

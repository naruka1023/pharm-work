import { NgModule } from '@angular/core';
import { OperatorDetailsComponent } from './buy/operator-details/operator-details.component';
import { BannerMenuComponent } from './buy/banner-menu/banner-menu.component';
import { ContactDetailsComponent } from './buy/contact-details/contact-details.component';
import { BannerSellPageComponent } from './buy/banner-sell-page/banner-sell-page.component';
import { SocialMediaSellPageComponent } from './buy/social-media-sell-page/social-media-sell-page.component';
import { RegisterComponent } from '../pharmacist/page/register/register.component';
import { LoginPageComponent } from '../pharmacist/page/login-page/login-page.component';
import { LandingPageComponent } from '../pharmacist/landing-page.component';

@NgModule({
  imports: [
    ContactDetailsComponent,
    BannerMenuComponent,
  ],
  declarations: [
    OperatorDetailsComponent,
    BannerSellPageComponent,
    SocialMediaSellPageComponent,
  ],
  exports:[
    OperatorDetailsComponent
  ],
})
export class SharedModuleModule {}

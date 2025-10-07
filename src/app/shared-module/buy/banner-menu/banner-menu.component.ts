import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';
import { LandingPageComponent } from 'src/app/pharmacist/landing-page.component';
import { ServiceService } from '../../service/service.service';

@Component({
  standalone:true,
  selector: 'app-banner-menu',
  templateUrl: './banner-menu.component.html',
  styleUrls: ['./banner-menu.component.css'],
  imports: [ContactDetailsComponent]
})
export class BannerMenuComponent {

  constructor(private service: ServiceService, private route:Router, private landingPage: LandingPageComponent){}
  onClick(){
    this.landingPage.hideBannerMenu()
    this.route.navigate(['pharma/buy-banner'])
        window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }
  onClickBannerProcess(){
    this.landingPage.hideBannerMenu()
    this.route.navigate(['pharma/buy-banner'])
    setTimeout(()=>{
      let element = document.getElementById("bannerSell")!
      element.scrollIntoView({ block: "start" });
    }, 500)
  }
  downloadContract(url: string){
    this.service.downloadContract(url)
  }
  onClickSocialMediaProcess(){
    this.landingPage.hideBannerMenu()
    this.route.navigate(['pharma/buy-social']) 
    setTimeout(()=>{
      let element = document.getElementById("socialMedia")!
      element.scrollIntoView({ block: "start" });
    }, 500)
  }
 onClickSocial(){
   this.landingPage.hideBannerMenu()
    this.route.navigate(['pharma/buy-social'])
        window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }
}

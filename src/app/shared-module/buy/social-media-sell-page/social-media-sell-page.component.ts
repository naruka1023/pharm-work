import { Component } from '@angular/core';
import { ServiceService } from '../../service/service.service';

@Component({
  selector: 'app-social-media-sell-page',
  templateUrl: './social-media-sell-page.component.html',
  styleUrls: ['./social-media-sell-page.component.css']
})
export class SocialMediaSellPageComponent {
  constructor(private service:ServiceService){}
  ngOnInit(){
  }

  redirectToSocialMedia(){
    let element = document.getElementById("socialMedia")!
    element.scrollIntoView({ block: "start" });
  }

  downloadContract(url: string){
    this.service.downloadContract(url)
  }

  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }
}

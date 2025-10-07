import { Component } from '@angular/core';
import { ServiceService } from '../../service/service.service';

@Component({
  selector: 'app-banner-sell-page',
  templateUrl: './banner-sell-page.component.html',
  styleUrls: ['./banner-sell-page.component.css']
})
export class BannerSellPageComponent {
  constructor(private service:ServiceService){}
  ngOnInit(){
  }
  redirectToBanner(){
    let element = document.getElementById("bannerSell")!
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

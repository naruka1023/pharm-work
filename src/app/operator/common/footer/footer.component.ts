import { Component } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';
import { LandingPageComponent } from '../../landing-page.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  constructor(private landingPageComponent: LandingPageComponent, private route: Router, private activatedRoute:ActivatedRoute){}
  loginFlag: boolean  =  (localStorage.getItem('loginState') === null || localStorage.getItem('loginState') === 'false')? false: true 
  
  openEmail(){
    this.landingPageComponent.openContactUsModal()
  }

  goToHome(){
    localStorage.removeItem('type')
    localStorage.removeItem('userUID')
    this.route.navigate(['operator'])
  }

  openAddModal(){
    this.landingPageComponent.openAddModal()
  }
  
  redirectToList(categorySymbol: string){
    if(localStorage.getItem('loginState') == 'true'){
      this.route.navigate(['jobs-list'],
      {
        relativeTo:this.activatedRoute,
        queryParams: 
        {
          CategorySymbol: categorySymbol,
        }
      })
    }else{
      this.route.navigate(['login'],
      {
        relativeTo:this.activatedRoute
      })
    }
  }
}

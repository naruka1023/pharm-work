import { Component } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  constructor(private route: Router, private activatedRoute:ActivatedRoute){}
  loginFlag: boolean  =  (localStorage.getItem('loginState') === null || localStorage.getItem('loginState') === 'false')? false: true 
  
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

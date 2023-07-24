import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  
  constructor(private route: Router, private activatedRoute:ActivatedRoute){}
  loginFlag: boolean  =  (localStorage.getItem('loginState') === null || localStorage.getItem('loginState') === 'false')? false: true 
  
  goToList(type:string){
    this.route.navigate(['users-list'],
    {
      relativeTo:this.activatedRoute,
      queryParams: 
      {
        type: type,
      }
    })
  }

}

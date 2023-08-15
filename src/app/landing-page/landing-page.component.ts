import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  constructor(private router:Router){
  }
  goHome(){
    this.router.navigate(['']).then(()=>{
      location.reload()
    })
  }
}

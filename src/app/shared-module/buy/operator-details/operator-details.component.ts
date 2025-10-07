import { Component } from '@angular/core';
import { LandingPageComponent } from 'src/app/pharmacist/landing-page.component';

@Component({
  selector: 'app-operator-details',
  templateUrl: './operator-details.component.html',
  styleUrls: ['./operator-details.component.css']
})
export class OperatorDetailsComponent {
  constructor(private landingPage:LandingPageComponent){}
  
  ngOnInit(){
    this.scrollUp()
  }
  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }

  operatorClick(){
    this.landingPage.onRegisterClick()
  }
  
  loginClick(){
    this.landingPage.onLoginClick()
  }
}

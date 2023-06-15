import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-jobs',
  templateUrl: './register-jobs.component.html',
  styleUrls: ['./register-jobs.component.css']
})
export class RegisterJobsComponent {
  constructor(private route: Router){}
  target = this.route.url.split('/')[this.route.url.split('/').length-1]  
  ngAfterViewInit(){
    if(this.target == 'request-views'){
      this.selectTab(this.target)
    }
  }
  selectTab(target:string){
    let triggerEl = document.getElementById(target)!;
    triggerEl.click()
  }
}
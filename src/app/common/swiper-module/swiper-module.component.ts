import { Component, Input, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { filterConditions, jobPostModel } from 'src/app/model/typescriptModel/jobPost.model';
@Component({
  selector: 'app-swiper-module',
  templateUrl: './swiper-module.component.html',
  styleUrls: ['./swiper-module.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SwiperModuleComponent {
  @Input()filterFlags!: filterConditions;
  content: jobPostModel[] = []
  filterVisibleFlag: boolean = false;
  urgentFlag: boolean = false;
  subject!: Subscription;
  collapseButton!: string
  
  constructor(private router: Router, private auth: AngularFireAuth){
    
  }

  ngOnInit(){
    for (const [key, value] of Object.entries(this.filterFlags.content!)) {
      this.content.push(value);
    }
    this.collapseButton = "#" + this.filterFlags.CategorySymbol;
    if(this.filterFlags.header === 'งานเภสัชด่วนรายวัน'){
      this.urgentFlag = true;
    }
  }

  toggleFilter(){
    this.filterVisibleFlag = !this.filterVisibleFlag
  }
  goToList(){
      if(localStorage.getItem('loginState') == 'true'){
        this.router.navigate(['jobs-list'],
        {
          queryParams: 
          {
            CategorySymbol: this.filterFlags.CategorySymbol,
          }
        })
      }else{
        this.router.navigate(['login'])
      }
  }
}

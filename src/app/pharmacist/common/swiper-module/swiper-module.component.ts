import { Component, Input, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { filterConditions, jobPostModel } from '../../model/typescriptModel/jobPost.model';
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
  
  constructor(private router: Router, private auth: AngularFireAuth, private activatedRoute:ActivatedRoute){
    
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
        relativeTo:this.activatedRoute,
        queryParams: 
        {
          CategorySymbol: this.filterFlags.CategorySymbol,
        }
      })
    }else{
      this.router.navigate(['login'],{
        relativeTo:this.activatedRoute
      })
    }
  }
}

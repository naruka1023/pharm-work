import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { filterConditions, jobPostModel, jobPostPayload } from '../../model/typescriptModel/jobPost.model';
import { JobPostService } from '../../service/job-post.service';
import _ from 'lodash';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-swiper-module',
  templateUrl: './swiper-module.component.html',
  styleUrls: ['./swiper-module.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SwiperModuleComponent {
  @Input()filterFlags!: filterConditions;
  content$!: Observable<jobPostModel[]>;
  content!: jobPostModel[];
  filterVisibleFlag: boolean = false;
  urgentFlag: boolean = false;
  subject!: Subscription;
  loading$!: Observable<boolean>;
  loading!: boolean;
  collapseButton!: string
  breakingPoint = {
    1400: {
      slidesPerView: 5
    },
    1200: {
      slidesPerView: 4
    },
    992: {
      slidesPerView: 3
    },
    768: {
      slidesPerView: 2
    },
    320: {
      slidesPerView: 1.5,
    }
  }
  breakingPointOperator = {
    1400: {
      slidesPerView: 5,
    },
    1200: {
      slidesPerView: 4,
    },
    992: {
      slidesPerView: 3,
    },
    768: {
      slidesPerView: 2.5,
    }
  }
  
  constructor(private jobPostService:JobPostService, private router: Router, private store: Store, private activatedRoute:ActivatedRoute){}

  ngOnInit(){
    // this.loading$ = this.store.select((state:any)=>{
    //   let newState = state.jobpost.JobPost.find((jobPost: any)=>{
    //     return jobPost.CategorySymbol == this.filterFlags.CategorySymbol
    //   })
    //   return newState.loading
    // })
    // this.loading$.subscribe((result:any)=>{
    //   console.log(result)
    // })

    // this.content$ = this.store.select((state:any)=>{
    //   let newState = state.jobpost.JobPost.find((jobPost: any)=>{
    //     return jobPost.CategorySymbol == this.filterFlags.CategorySymbol
    //   })
    //   return newState.content
    // })
    // this.content$.subscribe((result:any)=>{
    //   console.log(result)
    // })

    this.collapseButton = "#" + this.filterFlags.CategorySymbol;
    if(this.filterFlags.header === 'งานเภสัชด่วนรายวัน'){
      this.urgentFlag = true;
    }
  }

  toggleFilter(){
    this.filterVisibleFlag = !this.filterVisibleFlag
  }
  goToList(){
      this.router.navigate(['jobs-list'],
      {
        relativeTo:this.activatedRoute,
        queryParams: 
        {
          CategorySymbol: this.filterFlags.CategorySymbol,
        }
      })
   
  }
}

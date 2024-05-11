import { Component, Inject, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { filterConditions, jobPostModel, jobPostPayload } from '../../model/typescriptModel/jobPost.model';
import { JobPostService } from '../../service/job-post.service';
import _ from 'lodash';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
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
  subscriberFlag: any = {}
  subject!: Subscription;
  loading$!: Observable<boolean>;
  loading!: boolean;
  collapseButton!: string
  breakingPoint = {
    1400: {
      spaceBetween: 25,
      slidesPerView: 5
    },
    1200: {
      spaceBetween: 25,
      slidesPerView: 4
    },
    992: {
      slidesPerView: 3,
      spaceBetween: 25
    },
    625: {
      slidesPerView: 2,
      spaceBetween: 25
    },
    420: {
      spaceBetween: 20
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
  }
  
  constructor(@Inject(DOCUMENT) private document: Document, private jobPostService:JobPostService, private router: Router, private store: Store, private activatedRoute:ActivatedRoute){}

  ngOnInit(){
    this.store.select((state: any)=>{
      return state.jobpost.Banners
    }).subscribe((banner: any) =>{
      this.subscriberFlag = banner
    } )
    // this.loading$ = this.store.select((state:any)=>{
    //   let newState = state.jobpost.JobPost.find((jobPost: any)=>{
    //     return jobPost.CategorySymbol == this.filterFlags.CategorySymbol
    //   })
    //   return newState.loadingj
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

  redirectExternal(link: string){
    if(!link.includes('https://')){
      this.document.location.href = !(link.includes('https://') || link.includes('http://'))? 'https://' + link : link
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

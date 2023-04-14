import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import SwiperCore, { Grid, Navigation, Pagination } from "swiper";
import { jobPostModel, filterConditions } from '../../model/typescriptModel/jobPost.model';
import { JobPostService } from '../../service/job-post.service';
import { retrievedJobCategorySuccess } from '../../state/actions/job-post.actions';
SwiperCore.use([Grid, Pagination, Navigation]);

@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.css'],
})
export class JobsListComponent implements OnDestroy{
  loadingFlag:boolean = true;
  CategorySymbol!: string;
  header!: string;
  count!: number; 
  nearestJobFlag: boolean = false;
  brandToCategory!: string;
  subscription: Subscription = new Subscription();
  content$!: Observable<jobPostModel[] | undefined>;
  loading$!: Observable<boolean>;
  
  constructor(private route: ActivatedRoute, private store: Store, private jobPostService:JobPostService){
    this.CategorySymbol = this.route.snapshot.queryParamMap.get('CategorySymbol')!;
    this.content$ = this.store.select((state: any) =>{

      const jobList : filterConditions =  state.jobpost.JobPost.find((res: any)=>{
        return res.CategorySymbol == this.CategorySymbol
      });
      this.header = jobList.header;
      if(this.header =='งานเภสัชด่วนรายวัน'){
        this.nearestJobFlag = true;
      }
      this.brandToCategory = (jobList.brandToCategory !== undefined)? jobList.brandToCategory : '';
      this.count = jobList.count
      return jobList.allContent
    })
    this.subscription.add(this.content$.subscribe((content) =>{
      if(content!.length === 0){
        this.jobPostService.getJobCategoryService(this.CategorySymbol).subscribe((jobPosts: any) =>{
          this.store.dispatch(retrievedJobCategorySuccess({jobs:jobPosts}));
        })
      }else{
        this.loadingFlag = false;
      }
    }))
  }

  onChangeEvent(event: any){
    this.nearestJobFlag = event.target.checked;
    console.log(this.nearestJobFlag);
  }
  
  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
}

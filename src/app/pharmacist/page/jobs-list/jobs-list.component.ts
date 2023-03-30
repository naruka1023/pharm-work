import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import SwiperCore, { Grid, Navigation, Pagination } from "swiper";
import { jobPostModel, filterConditions } from '../../model/typescriptModel/jobPost.model';
import { getJobCategory } from '../../state/actions/job-post.actions';
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
  brandToCategory!: string;
  subscription: Subscription = new Subscription();
  content$!: Observable<jobPostModel[] | undefined>;
  loading$!: Observable<boolean>;
  
  constructor(private route: ActivatedRoute, private store: Store, private router: Router){
    this.CategorySymbol = this.route.snapshot.queryParamMap.get('CategorySymbol')!;
    this.content$ = this.store.select((state: any) =>{

      const jobList : filterConditions =  state.jobpost.JobPost.find((res: any)=>{
        return res.CategorySymbol == this.CategorySymbol
      });
      this.header = jobList.header;
      this.brandToCategory = (jobList.brandToCategory !== undefined)? jobList.brandToCategory : '';
      return jobList.allContent
    })
    this.subscription.add(this.content$.subscribe((content) =>{
      if(content!.length === 0){
        this.store.dispatch(getJobCategory({CategorySymbol: this.CategorySymbol}));
      }else{
        this.loadingFlag = false;
      }
    }))
  }
  
  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
}

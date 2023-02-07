import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { JobService } from 'src/app/operator/service/job.service';
import { getCreatedJobsSuccess } from 'src/app/operator/state/actions/job-post.actions';
import { jobPostModel } from 'src/app/pharmacist/model/typescriptModel/jobPost.model';

@Component({
  selector: 'app-all-jobs-posts',
  templateUrl: './all-jobs-posts.component.html',
  styleUrls: ['./all-jobs-posts.component.css']
})
export class AllJobsPostsComponent {
  constructor(private store: Store, private jobService:JobService){}
  loadingFlag: boolean = true;
  allCreatedJobs$!: Observable<jobPostModel[]>;
  sub:Subscription = new Subscription
  ngOnInit(){
    this.sub.add(this.store.select((state:any)=>{
      return state.createdJobs.loading
    }).subscribe((loading)=>{
      this.loadingFlag = loading;
    }))
    this.sub.add(this.store.select((state: any)=>{
      return state.user.uid
    }).subscribe((operatorUID:any)=>{
      if(operatorUID !== '' && this.loadingFlag){
        // this.store.dispatch(getCreatedJobs({operatorUID: operatorUID}))
        this.jobService.getJobsCreated(operatorUID).subscribe((jobs)=>{
          console.log('get successful');
          this.store.dispatch(getCreatedJobsSuccess({jobs:jobs}));
        })
      }
    }))
    this.allCreatedJobs$ = this.store.select((state:any)=>{
      return state.createdJobs.JobPost;
    })
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
  }
}

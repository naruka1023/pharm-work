import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { jobPostModel } from 'src/app/operator/model/jobPost.model';
import { JobService } from 'src/app/operator/service/job.service';

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
    this.allCreatedJobs$ = this.store.select((state:any)=>{
      return state.createdJobs.JobPost;
    })
  }
  
  ngOnDestroy(){
    this.sub.unsubscribe();
  }
}

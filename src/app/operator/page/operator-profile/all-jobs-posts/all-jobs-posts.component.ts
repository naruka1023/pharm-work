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
  allCreatedJobs$!: Observable<jobPostModel[]>;
  loading$!: Observable<boolean>;
  ngOnInit(){
    this.allCreatedJobs$ = this.store.select((state:any)=>{
      return state.createdJobs.JobPost;
    })
    this.loading$ = this.store.select((state:any)=>{
      return state.createdJobs.loading
    })
  }
}

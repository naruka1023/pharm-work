import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
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
  emptyFlag$!: Observable<boolean>
  emptyFlagNormal$!: Observable<boolean>
  emptyFlagUrgency$!: Observable<boolean>
  ngOnInit(){
    this.allCreatedJobs$ = this.store.select((state:any)=>{
      return state.createdJobs.JobPost;
    })
    this.emptyFlag$ = this.store.select((state: any)=>{
      return state.createdJobs.JobPost.length === 0
    })
    this.emptyFlagNormal$ = this.store.select((state: any)=>{
      let newCreatedJobs: jobPostModel[] = _.cloneDeep(state.createdJobs.JobPost)
      newCreatedJobs = newCreatedJobs.filter((job)=>{
        return job.Urgency == false
      })
      return newCreatedJobs.length === 0
    })
    this.emptyFlagUrgency$ = this.store.select((state: any)=>{
      let newCreatedJobs: jobPostModel[] = _.cloneDeep(state.createdJobs.JobPost)
      newCreatedJobs = newCreatedJobs.filter((job)=>{
        return job.Urgency == true
      })
      return newCreatedJobs.length === 0
    })
    this.loading$ = this.store.select((state:any)=>{
      return state.createdJobs.loading
    })
  }
}

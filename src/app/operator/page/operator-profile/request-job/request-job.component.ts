import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { jobPostModel, JobRequestList } from 'src/app/operator/model/jobPost.model';

@Component({
  selector: 'app-request-job',
  templateUrl: './request-job.component.html',
  styleUrls: ['./request-job.component.css']
})
export class RequestJobComponent {
  constructor(private store:Store){}
  jobRequests$!: Observable<jobPostModel[]>
  ngOnInit(){
    this.jobRequests$ = this.store.select((state:any)=>{
      let jobPosts:JobRequestList = state.createdJobs.JobRequests;
      let jobRequestsArray = [];
      for(const [key, value] of Object.entries(jobPosts)){
        jobRequestsArray.push(value.JobPost as jobPostModel)
      }
      return jobRequestsArray
    }).pipe(
      map((array)=>{
        return array
      })
    )
  }
}

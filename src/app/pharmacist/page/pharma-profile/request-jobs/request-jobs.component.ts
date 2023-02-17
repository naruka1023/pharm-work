import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { jobPostModel } from 'src/app/operator/model/jobPost.model';
import { JobRequestList } from 'src/app/pharmacist/model/typescriptModel/jobPost.model';

@Component({
  selector: 'app-request-jobs',
  templateUrl: './request-jobs.component.html',
  styleUrls: ['./request-jobs.component.css']
})
export class RequestJobsComponent {
  jobRequests$!:Observable<jobPostModel[]>

  constructor(private store:Store){}
  ngOnInit(){
    this.jobRequests$ = this.store.select((state:any)=>{
      let jobPosts:JobRequestList = state.jobpost.JobRequests;
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

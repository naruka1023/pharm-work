import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { jobPostModel, JobRequestList } from 'src/app/pharmacist/model/typescriptModel/jobPost.model';
import { User } from 'src/app/pharmacist/model/typescriptModel/users.model';

@Component({
  selector: 'app-request-jobs',
  templateUrl: './request-jobs.component.html',
  styleUrls: ['./request-jobs.component.css']
})
export class RequestJobsComponent {
  jobRequests$!:Observable<jobPostModel[]>
  emptyFlag$!:Observable<boolean>
  innerProfileInformation!: User;

  constructor(private store:Store){}
  ngOnInit(){
    this.store.select((state: any)=>{
      return state.user
    }).subscribe((value: User)=>{
      this.innerProfileInformation = value
    })
    this.jobRequests$ = this.store.select((state:any)=>{
      let jobPosts:JobRequestList = state.jobpost.JobRequests;
      let jobRequestsArray = [];
      for(const [key, value] of Object.entries(jobPosts)){
        jobRequestsArray.push(value.JobPost as any)
      }
      return jobRequestsArray
    }).pipe(
      map((array)=>{
        return array
      })
    )
    this.emptyFlag$ = this.store.select((state: any)=>{
      return Object.keys(state.jobpost.JobRequests).length === 0
    })
  }
}

import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { removeCurrentUser } from '../state/actions/users.action';
import { jobRequest } from './model/jobPost.model';
import { JobService } from './service/job.service';
import { emptyRequestedJobs, getRequestedJobs } from './state/actions/job-post.actions';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  subject!:Subscription
  constructor(private db:AngularFirestore, private jobService:JobService, private route:Router, private auth:AngularFireAuth, private store:Store){}

  ngOnInit(){
    this.subject = this.auth.user.subscribe((user)=>{
      if(user){
        this.jobService.getRequestJob(user.uid).subscribe((requestedJobs:any)=>{
          let jobIDList = requestedJobs.map((request:any)=>{ return request.jobUID})
          this.jobService.getJobsFromJobRequest(jobIDList).subscribe((jobPayload)=>{
            let payload = requestedJobs.map((requestedJob:any)=>{
              let job = {
                ...requestedJob,
                JobPost:jobPayload[requestedJob.jobUID]
              }
              return job
            })
            this.store.dispatch(getRequestedJobs({ jobRequest:payload }))
          })
        })
      }else{
        this.store.dispatch(emptyRequestedJobs());
      }
    })
  }
  goToAddJob(urgencyFlag:boolean){
    this.route.navigate(['/operator/add-new-jobs'], {
      queryParams: 
      {
        urgency: urgencyFlag
      }
    })
  }
  signOut(){
    if(this.route.url == '/operator'){
      this.route.navigate(['operator']).then(()=>{
          this.confirmSignout();
      })
    }else{
      this.route.navigate(['pharma']).then((bool:boolean)=>{
        if(bool){
          this.confirmSignout();
        }
      })
    }
  }
  
  confirmSignout(){
    this.auth.signOut();
    this.store.dispatch(removeCurrentUser());
  }
}

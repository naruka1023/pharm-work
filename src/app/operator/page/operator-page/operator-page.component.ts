import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { jobPostModel } from '../../model/jobPost.model';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-operator-page',
  templateUrl: './operator-page.component.html',
  styleUrls: ['./operator-page.component.css']
})
export class OperatorPageComponent {
  constructor(private store:Store){}
  allJobs$!: Observable<jobPostModel[]>
  allJobsFlag$!: Observable<boolean>
  User$!: Observable<User>;
  user!: User;
  profileLinkFlag: boolean = false;
  viewFlag:boolean = true

  ngOnInit(){
    this.allJobsFlag$ = this.store.select((state:any)=>{
      let jobPost: jobPostModel[] = state.createdJobs.JobPost
      return jobPost.filter((job:jobPostModel)=>{
        return job.Active === true
      }).length !== 0
    })
    this.allJobs$ = this.store.select((state:any)=>{
      let jobPost: jobPostModel[] = state.createdJobs.JobPost
      return jobPost.filter((job:jobPostModel)=>{
        return job.Active === true
      })
    })
    this.User$ = this.store.select((state:any)=>{
      return state.user
    })
    this.User$.subscribe((user)=>{
      this.user = user;
    })

  }

}

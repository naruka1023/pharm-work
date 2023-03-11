import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { profileHeaderOperator } from '../../model/typescriptModel/header.model';
import { jobPostModel, userOperator } from '../../model/typescriptModel/jobPost.model';
import { User } from '../../model/typescriptModel/users.model';
import { JobPostService } from '../../service/job-post.service';
import { UserServiceService } from '../../service/user-service.service';
import { setOperatorData } from '../../state/actions/job-post.actions';

@Component({
  selector: 'app-operator-page',
  templateUrl: './operator-page.component.html',
  styleUrls: ['./operator-page.component.css']
})
export class OperatorPageComponent {
  constructor(private store:Store, private route:ActivatedRoute,private userService:UserServiceService, private jobPostService:JobPostService){}
  allJobs$!: Observable<jobPostModel[]>
  allJobsFlag!:boolean
  User$!: Observable<User>;
  userLoadingFlag: boolean = true;
  user!: User;
  viewFlag:boolean = false
  operatorUID!: string
  operator?: userOperator
 
  
  ngOnInit(){
    this.operatorUID = this.route.snapshot.queryParamMap.get('operatorUID')!;
    this.allJobs$ = this.jobPostService.getJobOfOperator(this.operatorUID)
    this.allJobs$.subscribe((jobs)=>{
      this.allJobsFlag = jobs.length !== 0;
      this.userLoadingFlag = false
    })

    this.store.select((state:any)=>{
      return state.jobpost.operator
    }).subscribe((operator)=>{
      this.operator = operator
    })
    }
}


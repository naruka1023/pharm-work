import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { jobPostModel, userOperator } from '../../model/typescriptModel/jobPost.model';
import { User } from '../../model/typescriptModel/users.model';
import { JobPostService } from '../../service/job-post.service';
import { UserServiceService } from '../../service/user-service.service';
import { emptyOperatorData, setOperatorData, setOperatorJobs } from '../../state/actions/operator.actions';

@Component({
  selector: 'app-operator-page',
  templateUrl: './operator-page.component.html',
  styleUrls: ['./operator-page.component.css']
})
export class OperatorPageComponent {
  constructor(private store:Store, private route:ActivatedRoute,private userService:UserServiceService, private jobPostService:JobPostService){}
  allJobs$!: Promise<jobPostModel[]>
  allJobsFlag!:boolean
  User$!: Observable<User>;
  loading$!:Observable<boolean>
  user!: User;
  viewFlag:boolean = false
  operatorUID!: string
  zoom:number = 15
  operator?: userOperator
  requestViewFlag: boolean = false
  followFlag: boolean = false
  center: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  }
  ngOnInit(){
    this.store.dispatch(emptyOperatorData())
    this.loading$ = this.store.select((state:any) =>{
      return state.operator.loadingOperator
    })
    let follow = this.route.snapshot.queryParamMap.get('followFlag')
    this.followFlag = (follow == 'false'? false: true)
    this.operatorUID = this.route.snapshot.queryParamMap.get('operatorUID')!;
    let request = this.route.snapshot.queryParamMap.get('requestViewFlag')!;
    this.requestViewFlag = (request == 'false'?false: true)
    this.allJobs$ = this.jobPostService.getJobOfOperator(this.operatorUID)
    this.allJobs$.then((jobs: jobPostModel[])=>{
      this.userService.getOperatorData(this.operatorUID).then((operator)=>{
        let operator2 = operator.data() as userOperator
        this.userService.getNumberOfFollowers(operator.id).then((count)=>{
          this.allJobsFlag = jobs.length !== 0;
          let payload: any = {
            ...operator2,
            followers:count
          }
          this.store.dispatch(setOperatorJobs({jobs:jobs}))
          this.store.dispatch(setOperatorData({operator:payload}))
        })
      })
    })

    this.store.select((state:any)=>{
      return state.operator
    }).subscribe((operator)=>{
      this.operator = operator
      this.center = operator._geoloc
      this.markerPosition = operator._geoloc
    })
    }
}


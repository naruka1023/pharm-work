import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filterConditions, jobPostModel, userOperator } from '../../model/typescriptModel/jobPost.model';
import { User } from '../../model/typescriptModel/users.model';
import { JobPostService } from '../../service/job-post.service';
import { UserServiceService } from '../../service/user-service.service';
import { emptyOperatorData, setOperatorData, setOperatorJobs } from '../../state/actions/operator.actions';
import { setExistingOperatorData, toggleJobs } from '../../state/actions/job-post.actions';

@Component({
  selector: 'app-operator-page',
  templateUrl: './operator-page.component.html',
  styleUrls: ['./operator-page.component.css']
})
export class OperatorPageComponent implements OnDestroy{
  constructor(private store:Store, private route:ActivatedRoute,private userService:UserServiceService, private jobPostService:JobPostService){}
  allJobs$!: Observable<jobPostModel[]>
  allJobs!: jobPostModel[]
  allJobsFlag!:boolean
  User$!: Observable<User>;
  loading$!:Observable<boolean>
  user!: User;
  content!: userOperator  
  jobType!: string
  operatorExistFlag: boolean = false
  requestViewFlag: boolean = false
  followFlag: boolean = false
  viewFlag:boolean = false
  operatorUID!: string
  subscription: Subscription = new Subscription
  zoom:number = 15
  operator?: userOperator
  center: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  }
  ngOnInit(){
    let follow = this.route.snapshot.queryParamMap.get('followFlag')
    this.followFlag = (follow == 'false'? false: true)
    this.operatorUID = this.route.snapshot.queryParamMap.get('operatorUID')!;
    let request = this.route.snapshot.queryParamMap.get('requestViewFlag')!;
    this.requestViewFlag = (request == 'false'?false: true)
    this.jobType = this.route.snapshot.queryParamMap.get('jobType')!

    this.operatorExistFlag = this.route.snapshot.queryParamMap.get('operatorExistFlag') == 'true'? true: false
    if(!this.operatorExistFlag){
      this.store.dispatch(emptyOperatorData())
      this.jobPostService.getJobOfOperator(this.operatorUID).then((jobs: jobPostModel[])=>{
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
    }
    this.loading$ = this.store.select((state:any) =>{
      if(this.operatorExistFlag){
        let categorySymbol = this.jobType == 'ร้านยาแบรนด์'? 'BA' : 'CB'
        let fC = state.jobpost.JobPost.find((filterCondition: filterConditions)=>{
          return filterCondition.CategorySymbol == categorySymbol
        }) as filterConditions
        return fC.content.find((user: userOperator)=>{
          return user.uid == this.operatorUID
        }).loadingOperator
      }
      return state.operator.loadingOperator
    })
    this.subscription.add(
      this.store.select((state:any)=>{
        if(this.operatorExistFlag){
          let categorySymbol = this.jobType == 'ร้านยาแบรนด์'? 'BA' : 'CB'
            let jobs = state.jobpost.JobPost.find((filterCondition: filterConditions)=>{
              return filterCondition.CategorySymbol == categorySymbol
            }).content.find((user: userOperator)=>{
              return user.uid == this.operatorUID
            }).operatorJobs
            let payload: jobPostModel[] = []
            if(jobs !== undefined){
              Object.keys(jobs).forEach((key)=>{
                payload.push(jobs[key])
              })
            }
            return payload
        }else{
          let jobs =  state.operator.operatorJobs
          let payload: jobPostModel[] = []
          if(jobs !== undefined){
            Object.keys(jobs).forEach((key)=>{
              payload.push(jobs[key])
            })
          }  
          return payload
        }
      }).subscribe((allJobs)=>{
        this.allJobs = allJobs
        console.log(this.allJobs)
      })
    )
    this.store.select((state:any)=>{
      if(this.operatorExistFlag){
        let categorySymbol = this.jobType == 'ร้านยาแบรนด์'? 'BA' : 'CB'
          let fC = state.jobpost.JobPost.find((filterCondition: filterConditions)=>{
            return filterCondition.CategorySymbol == categorySymbol
          }) as filterConditions
          return fC.content.find((user: userOperator)=>{
            return user.uid == this.operatorUID
          })
      }else{
        return state.operator
      }
    }).subscribe((operator: userOperator)=>{
      if(operator.followers === undefined && operator.operatorJobs === undefined && this.operatorExistFlag){
        this.jobPostService.getJobOfOperator(this.operatorUID).then((jobs)=>{
          this.userService.getNumberOfFollowers(this.operatorUID).then((count)=>{
            this.allJobsFlag = jobs.length !== 0;
            this.store.dispatch(setExistingOperatorData({operatorUID: this.operatorUID, jobType: this.jobType, followers:count, jobs: jobs}))
          })
        })
      }else{
        this.allJobsFlag = true
      }
      this.operator = operator
      this.center = operator._geoloc!
      this.markerPosition = operator._geoloc!
    })
    this.store.dispatch(toggleJobs())
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}


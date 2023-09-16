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
  allJobsFlagUrgent:boolean = false
  allJobsFlagNormal:boolean = false
  User$!: Observable<User>;
  loading$!:Observable<boolean>
  user!: User;
  content!: userOperator  
  jobType!: string
  operatorExistFlag: boolean = false
  geolocFlag!: boolean;
  requestViewFlag: boolean = false
  followFlag: boolean = false
  viewFlag:boolean = false
  operatorUID!: string
  subscription: Subscription = new Subscription
  zoom:number = 15
  operator?: userOperator
  none: google.maps.MapOptions = {
    gestureHandling:'greedy'
  };
  center: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  }
  ngOnInit(){
    const follow = this.route.snapshot.queryParamMap.get('followFlag')
    this.followFlag = (follow == 'false'? false: true)
    this.operatorUID = this.route.snapshot.queryParamMap.get('operatorUID')!;
    const request = this.route.snapshot.queryParamMap.get('requestViewFlag')!;
    this.requestViewFlag = (request == 'false'?false: true)
    this.jobType = this.route.snapshot.queryParamMap.get('jobType')!

    this.operatorExistFlag = this.route.snapshot.queryParamMap.get('operatorExistFlag') == 'true'? true: false
    if(!this.operatorExistFlag){
      this.store.dispatch(emptyOperatorData())
      this.jobPostService.getJobOfOperator(this.operatorUID).then((jobs: jobPostModel[])=>{
        this.userService.getOperatorData(this.operatorUID).then((operator)=>{
          const operator2 = operator.data() as userOperator
          this.userService.getNumberOfFollowers(operator.id).then((count)=>{
            this.allJobsFlag = jobs.length !== 0;
            if(this.allJobsFlag){
              jobs.forEach((job)=>{
                if(job.Urgency){
                  this.allJobsFlagUrgent = true
                }else{
                  this.allJobsFlagNormal = true
                }
              })
            }else{
              this.allJobsFlagNormal = false;
              this.allJobsFlagUrgent = false;
            }
            const payload: any = {
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
        const categorySymbol = this.jobType == 'ร้านยาแบรนด์' || this.jobType == 'โรงพยาบาล'? 'BA' : 'CB'
        const fC = state.jobpost.JobPost.find((filterCondition: filterConditions)=>{
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
          const categorySymbol = this.jobType == 'ร้านยาแบรนด์' || this.jobType == 'โรงพยาบาล'? 'BA' : 'CB'
            const jobs = state.jobpost.JobPost.find((filterCondition: filterConditions)=>{
              return filterCondition.CategorySymbol == categorySymbol
            }).content.find((user: userOperator)=>{
              return user.uid == this.operatorUID
            }).operatorJobs
            const payload: jobPostModel[] = []
            if(jobs !== undefined){
              Object.keys(jobs).forEach((key)=>{
                payload.push(jobs[key])
              })
            }
            return payload
        }else{
          const jobs =  state.operator.operatorJobs
          const payload: jobPostModel[] = []
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
        const categorySymbol = this.jobType == 'ร้านยาแบรนด์' || this.jobType == 'โรงพยาบาล'? 'BA' : 'CB'
          const fC = state.jobpost.JobPost.find((filterCondition: filterConditions)=>{
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
            if(this.allJobsFlag){
              jobs.forEach((job)=>{
                if(job.Urgency){
                  this.allJobsFlagUrgent = true
                }else{
                  this.allJobsFlagNormal = true
                }
              })
            }else{
              this.allJobsFlagNormal = false;
              this.allJobsFlagUrgent = false;
            }
            this.store.dispatch(setExistingOperatorData({operatorUID: this.operatorUID, jobType: this.jobType, followers:count, jobs: jobs}))
          })
        })
      }else{
        this.allJobsFlag = this.allJobs.length !== 0;
        if(this.allJobsFlag){
          this.allJobs.forEach((job)=>{
            if(job.Urgency){
              this.allJobsFlagUrgent = true
            }else{
              this.allJobsFlagNormal = true
            }
          })
        }else{
          this.allJobsFlagNormal = false;
          this.allJobsFlagUrgent = false;
        }
      }
      this.operator = operator
      this.center = operator._geoloc!
      if(operator._geoloc !== undefined){
        this.geolocFlag = true
      }else{
        this.geolocFlag = false
      }
      this.markerPosition = operator._geoloc!
    })
    this.store.dispatch(toggleJobs())
    this.scrollUp()
  }
  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}


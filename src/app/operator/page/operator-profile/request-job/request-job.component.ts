import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { map, Observable, Subscription } from 'rxjs';
import { collatedJobRequest, jobPostModel,  JobRequestList, jobUIDForUser } from 'src/app/operator/model/jobPost.model';
import {  UserPharma, requestView, requestViewList } from 'src/app/operator/model/user.model';
import { JobService } from 'src/app/operator/service/job.service';
import { UsersService } from 'src/app/operator/service/users.service';
import { UtilService } from 'src/app/operator/service/util.service';
import { removeUserFromRequestedJob, populateJobRequestWithUser, setRequestedJobs, populateJobRequestWithUsers, toggleUserList } from 'src/app/operator/state/actions/job-request-actions';
import { OperatorProfileComponent } from '../operator-profile.component';
declare var window: any;

@Component({
  selector: 'app-request-job',
  templateUrl: './request-job.component.html',
  styleUrls: ['./request-job.component.css']
})
export class RequestJobComponent  implements OnDestroy, AfterViewInit {
  constructor(private operatorProfileComponent: OperatorProfileComponent,private route: ActivatedRoute,private store:Store, private utilService:UtilService, private userService:UsersService, private jobService:JobService){}
  jobRequests$!: Observable<jobPostModel[]>
  usersPayload!: UserPharma[]
  profileLinkFlag: boolean = false;
  requestViews$!: Observable<requestView[]>
  emptyFlagRequestView$!: Observable<boolean>
  modal!: any;
  modalLoadingFlag: boolean = true;
  emptyFlag$!: Observable<boolean>  
  jobID: string = ''
  subscription:Subscription = new Subscription();
  loadingFlag$!:Observable<boolean>
  collatedList: any = {};


  ngAfterViewInit(): void {
    let isRequestView = this.route.snapshot.queryParamMap.get('isRequestView')!;
    if(isRequestView !== null){
      this.selectTab('private-profile')
    }
  }
  
  ngOnInit(){
    this.modal = new window.bootstrap.Modal(
      document.getElementById('myModal2')
    );
    this.loadingFlag$ = this.store.select((state:any)=>{
      return state.requestedJobs.loadingRequest
    })
    this.emptyFlag$ = this.store.select((state: any)=>{
      return Object.keys(state.requestedJobs.JobRequests).length === 0
    })
    this.emptyFlagRequestView$ = this.store.select((state: any)=>{

      return Object.keys(state.requestView).length == 0
    })
    this.requestViews$ = this.store.select((state:any)=>{
      let requestViews: requestViewList = state.requestView;
      let requestViewsArray = []
      for (const [key, value] of Object.entries(requestViews)) {
        requestViewsArray.push(value);
      }
      return requestViewsArray
    }).pipe(
      map((array)=>{
        return array
      })
    )
    this.jobRequests$ = this.store.select((state:any)=>{
      if(!state.user.loading){
        if(state.requestedJobs.loadingRequest){
          this.jobService.getRequestJob(state.user.uid)
        }else{
          let isRequestView = this.route.snapshot.queryParamMap.get('isRequestView')!;
          if(isRequestView !== null){
            this.selectTab('private-profile')
          }

          let jobPosts:JobRequestList = state.requestedJobs.JobRequests;
          let jobRequestsArray = [];
          for(const [key, value] of Object.entries(jobPosts)){
            let job = state.createdJobs.JobPost.find((job: jobPostModel)=>{
              return job.custom_doc_id == value.jobRequest.jobUID
            }) as jobPostModel
            jobRequestsArray.push(job)
          }
          return jobRequestsArray;
        }
      }
      return [];
    })
    this.jobRequests$.subscribe((s:any)=>{
    })
    this.store.select((state:any)=>{
      let users:any = []
      if(this.jobID !== '')
      {
        users = state.requestedJobs.JobRequests[this.jobID].users
      }
      return users
    }).subscribe((users:any)=>{
      let payload: any = []
      Object.keys(users).forEach((userKey:string) =>{
        payload.push(users[userKey])
      })
      this.usersPayload = payload
      this.modalLoadingFlag = false;
    })
    this.subscription.add(
      this.utilService.getUserRequestSubject().subscribe((jobUIDForUser: jobUIDForUser)=>{
        this.modalLoadingFlag = jobUIDForUser.flag!;
        this.jobID = jobUIDForUser.jobUID
        if(jobUIDForUser.flag){
          this.userService.getListOfUsersFromJobRequests(jobUIDForUser.userArray!).then((users:UserPharma[])=>{
            let usersList: any = {};
            users.forEach((user: UserPharma)=>{
              usersList[user.requestUID + '-' + user.uid] = user;
            })
            this.store.dispatch(populateJobRequestWithUsers({jobUIDForUsers:{userList: usersList, jobUID:jobUIDForUser.jobUID }}))
            let list = _.cloneDeep(this.jobService.getCollatedList());
            list[jobUIDForUser.jobUID]['flag'] = false;
            Object.keys(usersList).forEach((key: string)=>{
              list[jobUIDForUser.jobUID].users[key] = usersList[key];
            })
            this.jobService.setCollatedList(list)
          })
          this.modal.show()
        }else{
          this.store.dispatch(toggleUserList({jobUIDForUsers:{
            jobUID: jobUIDForUser.jobUID,
            flag: jobUIDForUser.flag,
          }}))
          this.modal.show()
        }
        })
    )
  }
  selectTab(target:string){
    let triggerEl = document.getElementById(target)!;
    if(triggerEl !== null){
      triggerEl.click()
    }
  }
  hideModal(){
    this.modal.hide()
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe(); 
  }
}

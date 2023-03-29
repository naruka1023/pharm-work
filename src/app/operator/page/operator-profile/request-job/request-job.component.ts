import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { map, Observable, Subscription } from 'rxjs';
import { collatedJobRequest, jobPostModel,  JobRequestList, jobUIDForUser } from 'src/app/operator/model/jobPost.model';
import {  UserPharma } from 'src/app/operator/model/user.model';
import { JobService } from 'src/app/operator/service/job.service';
import { UsersService } from 'src/app/operator/service/users.service';
import { UtilService } from 'src/app/operator/service/util.service';
import { removeUserFromRequestedJob, populateJobRequestWithUser, setRequestedJobs, populateJobRequestWithUsers, toggleUserList } from 'src/app/operator/state/actions/job-request-actions';
declare var window: any;

@Component({
  selector: 'app-request-job',
  templateUrl: './request-job.component.html',
  styleUrls: ['./request-job.component.css']
})
export class RequestJobComponent  implements OnDestroy {
  constructor(private store:Store, private utilService:UtilService, private userService:UsersService, private jobService:JobService){}
  jobRequests$!: Observable<jobPostModel[]>
  usersPayload!: UserPharma[]
  profileLinkFlag: boolean = false;
  modal!: any;
  modalLoadingFlag: boolean = true;
  jobID: string = ''
  subscription:Subscription = new Subscription();
  loadingFlag$!:Observable<boolean>
  collatedList: any = {};
  
  ngOnInit(){
    this.modal = new window.bootstrap.Modal(
      document.getElementById('myModal2')
    );
    this.loadingFlag$ = this.store.select((state:any)=>{
      return state.requestedJobs.loadingRequest
    })
    this.jobRequests$ = this.store.select((state:any)=>{
      if(!state.user.loading){
        if(state.requestedJobs.loadingRequest){
          this.jobService.getRequestJob(state.user.uid).subscribe((requestedJobs:any)=> {
              if(Object.keys(requestedJobs).length !== 0){
                let keys = requestedJobs.jobUID
                let list = _.cloneDeep(this.collatedList);
                if(list[keys] === undefined){
                  list[keys] = Object.create({})
                  list[keys]['jobRequest'] = {
                    ...requestedJobs,
                  }
                  list[keys]['users'] = Object.create({});
                  list[keys]['users'][requestedJobs.userUID] = Object.create({})
                  list[keys]['flag'] = true
                }else{
                  if(requestedJobs.type == 'removed'){
                    this.store.dispatch(removeUserFromRequestedJob({jobUIDForUser:{user:list[keys]['users'][requestedJobs.userUID], jobUID: keys}}))
                    delete list[keys]['users'][requestedJobs.userUID]
                    if(Object.keys(list[keys].users).length == 0){
                      delete list[keys]
                    }
                  }else{
                    if(!list[keys]['flag']){
                      this.userService.getUserFromJobRequest(requestedJobs.userUID).subscribe((user:any)=>{
                        list = _.cloneDeep(list);
                        list[keys]['users'][user.uid] = user
                        this.collatedList = list;
                        this.store.dispatch(populateJobRequestWithUser({jobUIDForUser:{user: user, jobUID:keys}}))
                      })
                    }
                    list[keys]['users'][requestedJobs.userUID] = Object.create({})
                  }
                }
                this.collatedList = list;
              }
              this.store.dispatch(setRequestedJobs({ jobRequest:this.collatedList }))
          })
        }else{
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
          this.userService.getListOfUsersFromJobRequests(jobUIDForUser.userArray!).subscribe((users:UserPharma[])=>{
            let usersList: any = {};
            users.forEach((user: UserPharma)=>{
              usersList[user.uid] = user;
            })
            this.store.dispatch(populateJobRequestWithUsers({jobUIDForUsers:{userList: usersList, jobUID:jobUIDForUser.jobUID }}))
            let list = _.cloneDeep(this.collatedList);
            list[jobUIDForUser.jobUID]['flag'] = false;
            Object.keys(usersList).forEach((key: string)=>{
              list[jobUIDForUser.jobUID].users[key] = usersList[key];
            })
            this.collatedList = list
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
  ngOnDestroy(): void {
    this.subscription.unsubscribe(); 
  }
}

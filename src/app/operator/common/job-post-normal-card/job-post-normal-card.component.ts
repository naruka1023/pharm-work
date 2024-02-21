import { Component, Input} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { jobPostModel } from '../../model/jobPost.model';
import { JobService } from '../../service/job.service';
import { UtilService } from '../../service/util.service';
import { AllJobsPostsComponent } from '../../page/operator-profile/all-jobs-posts/all-jobs-posts.component';
import { LandingPageComponent } from '../../landing-page.component';
import { UsersService } from '../../service/users.service';
import { UserPharma } from '../../model/user.model';
import _ from 'lodash';
import { populateJobRequestWithUsers, toggleUserList } from '../../state/actions/job-request-actions';
import { toggleFirstNotificationJob } from '../../state/actions/job-post.actions';
declare let window: any;
@Component({
  selector: 'app-job-post-normal-card',
  templateUrl: './job-post-normal-card.component.html',
  styleUrls: ['./job-post-normal-card.component.css']
})
export class JobPostNormalCardComponent{
  @Input() urgentFlag = true;
  @Input() fullTimeFlag = true;
  @Input() content!: jobPostModel
  @Input() profileLinkFlag:boolean = true;
  formModal: any;
  subscription: Subscription = new Subscription();
  loadingConfirmRequestFlag: boolean = false
  requestViewLoading: boolean = false
  userID!: string
  bookmarkID!: string; 
  userList?: string[];
  populatedUsersList?: {
    content: UserPharma
    requestID: string
  }[];
  latestDate: string = ''
  modalLoadingFlag: boolean = true;
  userListFlag?: boolean;
  amountRequested: number = 0 
  deleteLoadingFlag: boolean = false;
  activeLoadingFlag: boolean = false;
  userListLoadingFlag$!: Observable<boolean>;
  Active$!: Observable<boolean>
  activeFlag!:boolean;
  buttonSetFlag:boolean = false
  requestID: string = ''
  usersRequestList: boolean = false
  childrenPath?: string;
  breakingPoint = {
    1400: {
      slidesPerView: 4.5
    },
    1200: {
      slidesPerView: 4
    },
    992: {
      slidesPerView: 3
    },
    768: {
      slidesPerView: 2.5
    },
    500: {
      slidesPerView: 2
    },
  }
  
  constructor(private utilService:UtilService, private landingPageComponent: LandingPageComponent,private allJobPostComponent:AllJobsPostsComponent,private store:Store, private userService:UsersService, private router: Router, private jobService:JobService, private activatedRoute:ActivatedRoute){}

  ngOnInit(){
    this.childrenPath = this.activatedRoute.snapshot.routeConfig!.path;
    switch(this.activatedRoute.snapshot.routeConfig?.path){
      case 'all-jobs-posts':
        this.buttonSetFlag = true
        break;
      case 'request-jobs':
        this.usersRequestList = true;
        break;
    }
    if(this.urgentFlag){
      this.fullTimeFlag = false;
    }
    this.store.select((state:any)=>{
      if(this.childrenPath == 'request-jobs' && state.requestedJobs.JobRequests[this.content.custom_doc_id] !== undefined){
        this.userListFlag = state.requestedJobs.JobRequests[this.content.custom_doc_id].flag
        return state.requestedJobs.JobRequests[this.content.custom_doc_id].users
      }
      return null
    }).subscribe((users:any)=>{
      if(users !== null){
        this.userList = Object.keys(users);
        this.populatedUsersList = []
        this.amountRequested = this.userList.length
        this.populatedUsersList = this.userList.map((userID)=>{
          return {
            content: users[userID],
            requestID: userID.split('-')[0]
          }
        })
        const dates = this.populatedUsersList.map((user)=>{
          return  user.content.dateUpdated
        })
        dates.sort(function(a, b) {
          // Convert the date strings to Date objects
          let dateA: any = new Date(a);
          let dateB: any = new Date(b);
        
          // Subtract the dates to get a value that is either negative, positive, or zero
          return dateA - dateB;
        });
        this.latestDate = dates[dates.length -1]
      }
    })
    this.Active$ = this.store.select((state:any)=>{
      const selectedJob = state.createdJobs.JobPost.find((job: jobPostModel)=>{
        return job.custom_doc_id == this.content.custom_doc_id
      })
      return selectedJob !== undefined?selectedJob.Active: true;
    })
    this.Active$.subscribe((active)=>{

      this.activeFlag = active;
    })
    if(this.usersRequestList){
      this.getUsers()
    }
  }
  toggleShare(){
    this.landingPageComponent.toggleShare(this.content.custom_doc_id)
  }
  openDetailModal(){
    this.utilService.sendUserRequestSubject({userArray: this.userList!,flag:this.userListFlag!, jobUID: this.content.custom_doc_id});
  }
  getUsers(){
    this.modalLoadingFlag = this.userListFlag!;
    if(this.userListFlag){
      this.userService.getListOfUsersFromJobRequests(this.userList!).then((users:UserPharma[])=>{
        let usersList: any = {};
        users.forEach((user: UserPharma)=>{
          usersList[user.requestUID + '-' + user.uid] = user;
        })
        this.store.dispatch(populateJobRequestWithUsers({jobUIDForUsers:{userList: usersList, jobUID:this.content.custom_doc_id }}))
        let list = _.cloneDeep(this.jobService.getCollatedList());
        list[this.content.custom_doc_id]['flag'] = false;
        Object.keys(usersList).forEach((key: string)=>{
          list[this.content.custom_doc_id].users[key] = usersList[key];
        })
        this.jobService.setCollatedList(list)
      })
      // this.modal.show()
    }else{
      this.store.dispatch(toggleUserList({jobUIDForUsers:{
        jobUID: this.content.custom_doc_id,
        flag: this.userListFlag,
      }}))
      // this.modal.show()
    }
  }

  toggleActive(){
    if(!this.activeFlag && this.content.firstNotificationFlag){
      this.userService.propagateNotifications(this.content.custom_doc_id).subscribe((notification)=>{
        this.store.dispatch(toggleFirstNotificationJob({jobUID: this.content.custom_doc_id}))
      })
    }
    this.jobService.toggleActive(this.content.custom_doc_id, this.activeFlag)
  }

  editFlag(){
    this.router.navigate(['/operator/edit-jobs'], {
      queryParams: 
      {
        urgency: this.urgentFlag,
        id: this.content.custom_doc_id
      }
    })
  }
  openModal(){
    this.allJobPostComponent.openModal(this.content.custom_doc_id)
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }


  goToProfile(){
    this.router.navigate(['operator/job-detail'],
    {
      queryParams: 
      {
        id: this.content.custom_doc_id,
      }
    })
  }
}


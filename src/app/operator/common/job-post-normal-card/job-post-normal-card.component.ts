import { Component, Input} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { jobPostModel } from '../../model/jobPost.model';
import { JobService } from '../../service/job.service';
import { UtilService } from '../../service/util.service';
declare var window: any;
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
  userListFlag?: boolean;
  deleteLoadingFlag: boolean = false;
  activeLoadingFlag: boolean = false;
  userListLoadingFlag$!: Observable<boolean>;
  Active$!: Observable<boolean>
  activeFlag!:boolean;
  buttonSetFlag:boolean = false
  usersRequestList: boolean = false
  childrenPath?: string;
  
  constructor(private store:Store, private utilService:UtilService, private router: Router, private jobService:JobService, private activatedRoute:ActivatedRoute){}

  ngOnInit(){
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('confirmRequest')
      );
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
  }

  onClose(){
    this.formModal.hide()
  }
 
  getUsers(){
    this.utilService.sendUserRequestSubject({userArray: this.userList!,flag:this.userListFlag!, jobUID: this.content.custom_doc_id});
  }

  toggleActive(){
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
    this.formModal.show();
  }

  deleteCard(){
    this.formModal.hide()
    this.deleteLoadingFlag = true;
    this.jobService.removeJob(this.content.custom_doc_id).then(()=>{
      this.deleteLoadingFlag = false;
    })
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


import { Component, Input} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { jobPostModel, AppState, Bookmark, jobRequest } from '../../model/typescriptModel/jobPost.model';
import { JobPostService } from '../../service/job-post.service';
import { RoutingService } from '../../service/routing.service';
import { UtilService } from '../../service/util.service';
import { removeBookmark, removeJobRequest } from '../../state/actions/job-post.actions';
import { addRecentlySeen } from '../../state/actions/recently-seen.actions';
@Component({
  selector: 'app-job-post-normal-card',
  templateUrl: './job-post-normal-card.component.html',
  styleUrls: ['./job-post-normal-card.component.css']
})
export class JobPostNormalCardComponent{
  @Input() urgentFlag = true;
  @Input() fullTimeFlag = true;
  @Input() content!: jobPostModel
  @Input() cardType: string = 'JobRequests'
  subscription: Subscription = new Subscription();
  bookmarkLoadingFlag: boolean = false;
  bookmarkFlag$:Observable<boolean> = of(true);
  requestFlag$!:Observable<boolean>;  
  userID!: string
  Active$!:Observable<boolean>;
  childrenPath:string = '';
  bookmarkID!: string; 
  localFlag: boolean = true;
  requestButtonFlag:boolean = false
  cancelJobFlag: boolean = false
  jobRequestUID!: string;
  
  constructor(private activatedRoute:ActivatedRoute, private store: Store,private utilService:UtilService, private jobPostService: JobPostService, private router: Router, private auth: AngularFireAuth, private routeService:RoutingService){}

  ngOnInit(){
    this.store.select((state: any)=>{
      return state.user.uid
    }).subscribe((value)=>{
      if(value !== ''){
        this.userID = value
      }
    })
    this.childrenPath = this.activatedRoute.snapshot.routeConfig!.path!;
    switch(this.activatedRoute.snapshot.routeConfig?.path){
      case 'jobs-list':
        this.requestButtonFlag = true
        break;
      case 'request-jobs':
        this.cancelJobFlag = true;
        break;
    }
    this.store.select((state:any)=>{
      if(state.jobpost.JobRequests[this.content.custom_doc_id + '-' + this.userID] !== undefined){
        return state.jobpost.JobRequests[this.content.custom_doc_id + '-' + this.userID].custom_doc_id
      }
      return '';
    }).subscribe((jobRequestUID:string)=>{
      this.jobRequestUID = jobRequestUID;
    })
    this.requestFlag$ = this.store.select((state:any)=>{
      return state.jobpost.JobRequests[this.content.custom_doc_id + '-' + this.userID] !== undefined? true:false
    })
    this.Active$ = this.store.select((state:any)=>{
      const active: jobRequest = state.jobpost[this.cardType][this.content.custom_doc_id + '-' + this.userID]
      return (active === undefined)? false: !active.JobPost?.Active!;
    })
    this.bookmarkFlag$ = this.store.select((state: any) =>{
      let flag = true;
      if(this.userID !== ''){
        let newState: AppState = state.jobpost
        let bookmark: Bookmark = newState.Bookmarks[this.content.custom_doc_id + '-' + this.userID]
        if(bookmark === undefined){
          flag = false;
        }else{
          this.bookmarkID = bookmark.bookmarkUID!
        }
        this.localFlag = flag;
      }
      return flag 
    })
    if(this.urgentFlag){
      this.fullTimeFlag = false;
    }
  }

  cancelRequestJob(){
    this.jobPostService.cancelRequest(this.jobRequestUID).then(()=>{
      let jobRequest:jobRequest = {
        operatorUID: this.content.OperatorUID,
        userUID: this.userID,
        jobUID: this.content.custom_doc_id
      }
      this.utilService.sendRemoveRequestSubject(this.content.custom_doc_id)
      this.store.dispatch(removeJobRequest({jobRequest:jobRequest}))
    })
  }

  requestJob(){
    if(localStorage.getItem('loginState') == 'false'){
      this.router.navigate(['pharma/login'])
    }else{
      this.jobPostService.requestJob(this.content.custom_doc_id, this.content.OperatorUID, this.userID).then((value: any)=>{
        let jobRequest:jobRequest = {
          operatorUID: this.content.OperatorUID,
          userUID: this.userID,
          jobUID: this.content.custom_doc_id,
          JobPost:this.content,
          custom_doc_id: value.id
        }
        this.utilService.sendListenJobRequest(jobRequest)
      })
    }
  }
              
  getBookmarkPayload(){
    return {jobUID: this.content.custom_doc_id, userUID: this.userID, bookmarkUID: this.bookmarkID,JobPost: this.content};
  }
  toggleBookmark(){
    if(localStorage.getItem('loginState') === 'true'){
      this.bookmarkLoadingFlag = true
      if(this.localFlag === true){
        this.jobPostService.removeBookMarkService(this.bookmarkID).then((value: any)=>{
          this.store.dispatch(removeBookmark({jobUID: this.content.custom_doc_id, userUID: this.userID}))
          this.utilService.sendRemoveBookmarkSubject(this.content.custom_doc_id)
          this.bookmarkLoadingFlag = false
        })
      }else{
        this.jobPostService.addBookmarkService(this.content.custom_doc_id,this.userID).then((value)=>{
          this.bookmarkID = value.id
          this.utilService.sendListenJobBookmark(this.getBookmarkPayload())
          this.bookmarkLoadingFlag = false
        })
      }
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }


  goToProfile(){
    if(this.router.url !== 'pharma/profile-pharma/recently-seen-job'){
      this.store.dispatch(addRecentlySeen({JobPost: this.content}));
    }
    this.routeService.goToJobProfile(this.content.custom_doc_id, this.content.CategorySymbol)
  }
}


import { AfterViewInit, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { jobPostModel, AppState, Bookmark, jobRequest } from '../../model/typescriptModel/jobPost.model';
import { JobPostService } from '../../service/job-post.service';
import { RoutingService } from '../../service/routing.service';
import { UtilService } from '../../service/util.service';
import { removeBookmark } from '../../state/actions/job-post.actions';
import { addRecentlySeen } from '../../state/actions/recently-seen.actions';
import { LandingPageComponent } from '../../landing-page.component';

@Component({
  selector: 'app-job-post-small-card',
  templateUrl: './job-post-small-card.component.html',
  styleUrls: ['./job-post-small-card.component.css']
})
export class JobPostSmallCardComponent  {

  constructor(private landingPageComponent: LandingPageComponent, private utilService: UtilService, private jobPostService: JobPostService, private store: Store, private router: Router, private routeService: RoutingService){}

  @Input() fullTimeFlag = true 
  @Input() urgentFlag = false;
  @Input() content!: jobPostModel
  modalID! : string
  bookmarkLoadingFlag!:boolean;  
  bookmarkFlag$:Observable<boolean> = of(true);
  userID!: string
  subscription: Subscription = new Subscription();
  bookmarkID!: string; 
  requestFlag$!:Observable<boolean>;
  localFlag: boolean = true;
  limit = 25
  establishmentLimit = 21;
  jobName!: string;
  establishmentName!: string;
  fullName!: string 
  profileImageUrl!: string
  ngOnInit(){
    this.modalID = 'shareModal' + this.content.custom_doc_id
    if(this.content.cropProfilePictureUrl == ''){
      delete this.content.cropProfilePictureUrl
    }
    this.store.select((state: any)=>{
      return state.user.uid
    }).subscribe((value)=>{
      if(value !== ''){
        this.userID = value
      }
    })
    this.store.select((state: any) =>{
      return state.user.name + ' ' + state.user.surname
    }).subscribe((res)=>{
      this.fullName = res
    })
    this.store.select((state: any) =>{
      return state.user.cropProfilePictureUrl
    }).subscribe((res)=>{
      this.profileImageUrl = res
    })
    this.requestFlag$ = this.store.select((state:any)=>{
      return state.jobpost.JobRequests[this.content.custom_doc_id + '-' + this.userID] !== undefined?true:false
    })
    this.bookmarkFlag$ = this.store.select((state: any) =>{
      let flag = true;
      if(this.userID !== ''){
        const newState: AppState = state.jobpost
        const bookmark: Bookmark = newState.Bookmarks[this.content.custom_doc_id + '-' + this.userID]
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
toggleShare(){
  this.landingPageComponent.toggleShare(this.content)
}

  getBookmarkPayload(){
    return {jobUID: this.content.custom_doc_id, userUID: this.userID, bookmarkUID: this.bookmarkID, JobPost:this.content};
  }

  goToOperatorProfile(){
    this.router.navigate(['/pharma/operator-page'], {
      queryParams: 
      {
        operatorUID: this.content.OperatorUID,
        requestViewFlag: false,
        followFlag: false,
        operatorExistFlag: false,
        jobType: this.content.JobType
      }
    })
  }
  
  toggleBookmark(){
    if(localStorage.getItem('loginState') === 'true'){
      this.bookmarkLoadingFlag = true
      if(this.localFlag === true){
        
        this.jobPostService.removeBookMarkService(this.bookmarkID).then((value: any)=>{
          this.utilService.sendRemoveBookmarkSubject(this.content.custom_doc_id)
          this.store.dispatch(removeBookmark(this.getBookmarkPayload()));
          this.bookmarkLoadingFlag = false
        })
      }else{
        this.jobPostService.addBookmarkService(this.content.custom_doc_id,this.userID).then((value)=> {
          const jobName = this.content.JobName
          const establishment = this.content.Establishment
          this.landingPageComponent.appendAlertfromOutside({
            url:'empty',
            image: this.content.cropProfilePictureUrl !== undefined? this.content.cropProfilePictureUrl: this.content.profilePictureUrl,
            body:'',
            title:'ประกาศงาน "' + jobName + '" ของ "' + establishment + '" ได้ถูกบันทึกไว้ใน งานที่บันทึก เรียบร้อย'
          })
          this.bookmarkID = value.id
          this.utilService.sendListenJobBookmark(this.getBookmarkPayload())
          this.bookmarkLoadingFlag = false
        })
      }
    }
  }

  requestJob(){
    if(localStorage.getItem('loginState') == 'false'){
      this.router.navigate(['pharma/login'])
    }else{
      this.jobPostService.requestJob(this.fullName, this.profileImageUrl, this.content.custom_doc_id, this.content.OperatorUID, this.userID, this.content.JobName).then((value: any)=>{
          const jobRequest:jobRequest = {
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

  goToProfile(){
    if(this.router.url !== '/profile-pharma/recently-seen-job'){
      this.store.dispatch(addRecentlySeen({JobPost: this.content}));
    }
    this.routeService.goToJobProfile(this.content.custom_doc_id, this.content.CategorySymbol,'homePage')
  }
}

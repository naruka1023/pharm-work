import { Component, Input} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { jobPostModel, AppState, Bookmark, jobRequest } from '../../model/typescriptModel/jobPost.model';
import { JobPostService } from '../../service/job-post.service';
import { RoutingService } from '../../service/routing.service';
import { removeBookmark, addBookmark } from '../../state/actions/job-post.actions';
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
  subscription: Subscription = new Subscription();
  bookmarkLoadingFlag: boolean = false;
  bookmarkFlag$:Observable<boolean> = of(true);
  requestFlag$!:Observable<boolean>;  
  userID!: string
  Active$!:Observable<boolean>;
  bookmarkID!: string; 
  localFlag: boolean = true;
  
  constructor(private activatedRoute:ActivatedRoute,private store: Store, private jobPostService: JobPostService, private router: Router, private auth: AngularFireAuth, private routeService:RoutingService){}

  ngOnInit(){
    this.store.select((state: any)=>{
      return state.user.uid
    }).subscribe((value)=>{
      if(value !== ''){
        this.userID = value
      }
    })
    
    this.requestFlag$ = this.store.select((state:any)=>{
      return state.jobpost.JobRequests[this.content.custom_doc_id + '-' + this.userID] !== undefined?true:false
    })
    this.Active$ = this.store.select((state:any)=>{
      const active: jobRequest = state.jobpost.JobRequests[this.content.custom_doc_id + '-' + this.userID]
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

  requestJob(){
    if(localStorage.getItem('loginState') == 'false'){
      this.router.navigate(['pharma/login'])
    }else{
      this.jobPostService.requestJob(this.content.custom_doc_id, this.content.OperatorUID, this.userID).then(()=>{
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
          this.store.dispatch(removeBookmark(this.getBookmarkPayload()));
          this.bookmarkLoadingFlag = false
        })
      }else{
        this.jobPostService.addBookmarkService(this.content.custom_doc_id,this.userID).then((value)=>{
          this.bookmarkID = value.id
          this.store.dispatch(addBookmark(this.getBookmarkPayload()))
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
    this.routeService.goToJobProfile(this.content.custom_doc_id, this.content.CategorySymbol, this.activatedRoute)
  }
}


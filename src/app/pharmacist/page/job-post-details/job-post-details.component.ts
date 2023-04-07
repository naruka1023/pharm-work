import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { profileHeaderJobPost } from '../../model/typescriptModel/header.model';
import { AppState, Bookmark, jobPostModel, jobRequest } from '../../model/typescriptModel/jobPost.model';
import { JobPostService } from '../../service/job-post.service';
import { UtilService } from '../../service/util.service';
import { removeBookmark, addBookmark, addJobRequest } from '../../state/actions/job-post.actions';
import { emptyUrgentJobs, getUrgentJobsSuccess } from '../../state/actions/urgent-jobs.actions';

@Component({
  selector: 'app-job-post-details',
  templateUrl: './job-post-details.component.html',
  styleUrls: ['./job-post-details.component.css']
})
export class JobPostDetailsComponent implements OnDestroy{

  constructor(private jobPostService:JobPostService, private route: ActivatedRoute, private utilService:UtilService , private router: Router, private store: Store){}

  profilePayload$!:Observable<jobPostModel>;
  loading$!:Observable<boolean>;
  id!: string;
  categorySymbol!: string;
  profile!:jobPostModel;
  profileHeader!: profileHeaderJobPost;
  bookmarkLoadingFlag: boolean = false;
  detailLeavingFlag: boolean = true;
  bookmarkFlag$:Observable<boolean> = of(true);
  userID!: string
  bookmarkID!: string; 
  requestFlag$!: Observable<boolean>
  localFlag: boolean = true;
  operatorUID: any = null;
  urgentJobs:jobPostModel[] = []
  subscription: Subscription = new Subscription;


  ngOnInit(){
    this.detailLeavingFlag = true;
    this.store.select((state: any)=>{
      return state.user.uid
    }).subscribe((value)=>{
      if(value !== ''){
        this.userID = value
      }
      this.id = this.route.snapshot.queryParamMap.get('id')!;
      this.categorySymbol = this.route.snapshot.queryParamMap.get('categorySymbol')!;
      this.operatorUID = this.route.snapshot.queryParamMap.get('operatorUID')!;
      this.loading$ = this.store.select((state: any) =>{
        return state.jobpost.loading;
      });
      this.loading$.subscribe((res)=>{
        if(res){
          this.router.navigate(['/pharma'])
        }
      })
    })
    this.profilePayload$ = this.store.select((state: any)=>{
      const categories: jobPostModel[] = state.jobpost.JobPost;
      const jobPost: any = categories.find((job)=>{
        return job.CategorySymbol == this.categorySymbol
      })

      let newJob:jobPostModel = jobPost?.content?.find((profile: any) =>{
          return profile.custom_doc_id == this.id
      })
      return newJob
    })
    this.profilePayload$.subscribe((res: jobPostModel)=> {
      if(res !== undefined) {
        this.profile = res;
        this.profileHeader = {
          Establishment: this.profile.Establishment,
          JobType: this.profile.JobType
        }
      }
    })
    this.subscription.add(this.store.select((state:any)=>{
      return state.urgentJobs.urgentJobs
    }).subscribe((urgentJobs: any)=>{
      if(urgentJobs.length == 0 && this.detailLeavingFlag && this.profile.Urgency){
        this.jobPostService.getUrgentJobOfOperator(this.operatorUID).subscribe((jobs:jobPostModel[]) =>{
          if(jobs.length !== 0){
            this.store.dispatch(getUrgentJobsSuccess({jobs: jobs}));
          }
          this.urgentJobs = jobs;
        })
      }
    }))
    this.bookmarkFlag$ = this.store.select((state: any) =>{
      let flag = true;
      if(this.userID !== ''){
        let newState: AppState = state.jobpost
        let bookmark: Bookmark = newState.Bookmarks[this.profile.custom_doc_id + '-' + this.userID]
        if(bookmark === undefined){
          flag = false;
        }else{
          this.bookmarkID = bookmark.bookmarkUID!
        }
        this.localFlag = flag;
      }
      return flag 
    })
    this.requestFlag$ = this.store.select((state:any)=>{
      return state.jobpost.JobRequests[this.profile.custom_doc_id + '-' + this.userID] !== undefined?true:false
    })
    this.scrollUp();
  }


  requestJob(){
    if(localStorage.getItem('loginState') == 'false'){
      this.router.navigate(['pharma/login'])
    }else{
      this.jobPostService.requestJob(this.profile.custom_doc_id, this.profile.OperatorUID, this.userID).then((value: any)=>{
        let jobRequest:jobRequest = {
          operatorUID: this.profile.OperatorUID,
          userUID: this.userID,
          jobUID: this.profile.custom_doc_id,
          JobPost:this.profile,
          custom_doc_id: value.id
        }
        this.utilService.sendListenJobRequest(jobRequest)
      })
    }
  }
  
  getBookmarkPayload(){
    return {jobUID: this.profile.custom_doc_id, userUID: this.userID, bookmarkUID: this.bookmarkID, JobPost:this.profile};
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
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
        this.jobPostService.addBookmarkService(this.profile.custom_doc_id,this.userID).then((value)=>{
          this.bookmarkID = value.id
          this.utilService.sendListenJobBookmark(this.getBookmarkPayload())
          this.bookmarkLoadingFlag = false
        })
      }
    }
  }

  acceptJob(){
    if(localStorage.getItem('loginState') == 'false'){
      this.router.navigate(['login'])
    }
  }
  
  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }
}

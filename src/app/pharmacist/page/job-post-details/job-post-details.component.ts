import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { profileHeaderJobPost } from '../../model/typescriptModel/header.model';
import { AppState, Bookmark, jobPostModel } from '../../model/typescriptModel/jobPost.model';
import { JobPostService } from '../../service/job-post.service';
import { removeBookmark, addBookmark } from '../../state/actions/job-post.actions';

@Component({
  selector: 'app-job-post-details',
  templateUrl: './job-post-details.component.html',
  styleUrls: ['./job-post-details.component.css']
})
export class JobPostDetailsComponent {

  constructor(private jobPostService:JobPostService, private route: ActivatedRoute, private auth: AngularFireAuth, private router: Router, private store: Store){}

  profilePayload$!:Observable<jobPostModel>;
  loading$!:Observable<boolean>;
  id!: string;
  categorySymbol!: string;
  profile!:jobPostModel;
  profileHeader!: profileHeaderJobPost;
  bookmarkLoadingFlag: boolean = false;
  bookmarkFlag$:Observable<boolean> = of(true);
  userID!: string
  bookmarkID!: string; 
  localFlag: boolean = true;

  ngOnInit(){
    this.store.select((state: any)=>{
      return state.user.uid
    }).subscribe((value)=>{
      if(value !== ''){
        this.userID = value
      }
    })
    this.id = this.route.snapshot.queryParamMap.get('id')!;
    this.categorySymbol = this.route.snapshot.queryParamMap.get('categorySymbol')!;
    this.loading$ = this.store.select((state: any) =>{
      return state.jobpost.loading;
    });
    this.loading$.subscribe((res)=>{
      if(res){
        this.router.navigate(['/pharma'])
      }
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
    this.profilePayload$.subscribe((res: jobPostModel)=>{
      if(res !== undefined){
        this.profile = res;
        this.profileHeader = {
          Establishment: this.profile.Establishment,
          JobType: this.profile.JobType
        }
      }
    })
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
    this.scrollUp();
  }

  getBookmarkPayload(){
    return {jobUID: this.profile.custom_doc_id, userUID: this.userID, bookmarkUID: this.bookmarkID, JobPost:this.profile};
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
          this.store.dispatch(addBookmark(this.getBookmarkPayload()))
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

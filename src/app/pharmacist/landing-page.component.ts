import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { JobPostService } from './service/job-post.service';
import { updateFollowersList, addJobRequest, addBookmark, EmptyJobPostAppState, removeJobRequest, removeBookmark } from './state/actions/job-post.actions';
import { removeRecentlySeen } from './state/actions/recently-seen.actions';
import { removeCurrentUser } from '../state/actions/users.action';
import { Bookmark, Follow, jobPostModel, jobRequest } from './model/typescriptModel/jobPost.model';
import { UtilService } from './service/util.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {

  loginFlag: boolean = false;
  subject!: Subscription;
  i: number = 0;
  parsedJobs: jobPostModel[] = []
  subscription: any = {};
  bookmarkSubscription: any = {}

constructor(private db:AngularFirestore, private activatedRoute:ActivatedRoute,private jobService:JobPostService, private store: Store ,private route: Router, private auth: AngularFireAuth, private utilService:UtilService) {
  
}
ngOnInit(){  
  this.store.select((state: any)=>{
    return state.recentlySeen
  }).subscribe((recentlySeen)=>{
    if(recentlySeen.length > 10){
      this.store.dispatch(removeRecentlySeen());
    }
  })
  this.subject = this.auth.user.subscribe((user)=>{
    if(user){
      // this.db.collection("users", ref => ref.where('role', '==', "เภสัชกร")).get().subscribe((docs) =>{
      //   docs.forEach((doc:any)=>{
      //     this.db.collection("users").doc(doc.id).update({coverPhotoOffset: 0}).then((newDoc: any)=>{
      //       console.log(`${newDoc.id} updatedSuccessfully`)
      //     })
      //   })
      // })
      this.jobService.getUserBookmark(user.uid).subscribe((bookmarks)=>{
          bookmarks.forEach((bookmark: Bookmark)=>{
            this.bookmarkSubscription[bookmark.jobUID] = this.jobService.getJobFromBookmark(bookmark).subscribe((bk)=>{
                if(bk.type == "removed"){
                  this.store.dispatch(removeBookmark({jobUID: bk.jobUID!, userUID: bk.userUID!}));
                  this.utilService.sendRemoveBookmarkSubject(bk.userUID)
                }else{
                  this.store.dispatch(addBookmark({jobUID: bk.jobUID!, userUID: bk.userUID!, bookmarkUID: bk.bookmarkUID!, JobPost: bk.JobPost!}))
                }
            })

          })
      })
      this.utilService.getRemoveBookmarkSubject().subscribe((value:any)=>{
        this.bookmarkSubscription[value.jobUID].unsubscribe();
        delete this.bookmarkSubscription[value.jobUID];
      })
      this.utilService.getListenJobBookmark().subscribe((value: any)=> {
        this.bookmarkSubscription[value.jobUID] = this.jobService.getJobFromBookmark(value).subscribe((v:any)=>{
            if(v.type == "removed"){
              this.store.dispatch(removeBookmark({jobUID: v.jobUID!, userUID: v.userUID!}));
              this.utilService.sendRemoveBookmarkSubject(v.userUID)
            }else{
              this.store.dispatch(addBookmark(v))
            }
        })
      })
      
      this.jobService.getFollowers(user.uid).subscribe((followers:any)=>{
        followers = followers.docs.map((follower:any)=> {
          return {
            ...follower.data(),
            followUID:follower.id
          }
        })
        let followIDList = followers.map((request:Follow)=>{return request.operatorUID})
        this.jobService.getOperatorFromFollows(followIDList).subscribe((operators)=>{
          let payload: Follow[] = followers.map((follower:Follow)=>{
            let job = {
              ...follower,
              user:operators[follower.operatorUID]
            }
            return job
          })
          this.store.dispatch(updateFollowersList({ followers:payload }))
        })

      })
      this.jobService.getRequestJob(user.uid).subscribe((requestedJobs:any)=>{
        requestedJobs = requestedJobs.docs.map((requestedJob:any)=> {
          return {
            ...requestedJob.data(),
            custom_doc_id:requestedJob.id
          }
        }) as jobRequest[]
        let jobIDList:string[] = requestedJobs.map((request:any)=>{return request.jobUID})
        jobIDList.forEach((jobUID:string)=>{
          this.subscription[jobUID] = this.jobService.getJobFromJobRequest(jobUID).subscribe((jobPayload: any)=>{
            let payload = requestedJobs.find((jobRequest:any)=>{
              return jobRequest.jobUID == jobPayload.custom_doc_id
            })
            if(jobPayload.type == 'removed'){
              this.store.dispatch(removeJobRequest({jobRequest:{
                ...payload,
              }}))
              this.utilService.sendRemoveRequestSubject(jobPayload.custom_doc_id)
            }else{
              this.store.dispatch(addJobRequest({ 
                jobRequest:{
                  ...payload,
                  JobPost:jobPayload 
                } 
              }))
            }
          })

        })
      })
      this.utilService.getRemoveRequestSubject().subscribe((value:any)=>{
        this.subscription[value].unsubscribe();
        delete this.subscription[value]
      })
      this.utilService.getListenJobRequest().subscribe((value: any)=> {
        this.subscription[value.jobUID] = this.jobService.getJobFromJobRequest(value.jobUID).subscribe((v:any)=>{
          if(v.type == "removed"){
            this.utilService.sendRemoveRequestSubject(value.jobUID)
            this.store.dispatch(removeJobRequest({jobRequest:value}))
          }else{
            let newValue = {
              ...value,
              JobPost: v
            }
            this.store.dispatch(addJobRequest({jobRequest:newValue}))
          }
          })
      })
    }else{
      this.store.dispatch(EmptyJobPostAppState());
    }
  })
  this.loginFlag = true;
  this.loginFlag = (localStorage.getItem('loginState') === null || localStorage.getItem('loginState') === 'false')? false: true 
  
}

  signOut(){
    if(this.route.url == '/pharma'){
      this.route.navigate(['']).then(()=>{
          this.confirmSignout();
      })
    }else{
      this.route.navigate(['']).then((bool:boolean)=>{
        if(bool){
          this.confirmSignout();
        }
      })
    }
  }
  
  confirmSignout(){
    this.auth.signOut();
    this.store.dispatch(removeCurrentUser());
  }

  redirectToList(categorySymbol: string){
    if(localStorage.getItem('loginState') == 'true'){
      this.route.navigate(['jobs-list'],
      {
        relativeTo:this.activatedRoute,
        queryParams: 
        {
          CategorySymbol: categorySymbol,
        }
      })
    }else{
      this.route.navigate(['login'],
      {
        relativeTo:this.activatedRoute
      })
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

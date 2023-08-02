import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { JobPostService } from './service/job-post.service';
import { updateFollowersList, addJobRequest, addBookmark, EmptyJobPostAppState, removeJobRequest, removeBookmark, retrievedJobSuccess } from './state/actions/job-post.actions';
import { removeRecentlySeen } from './state/actions/recently-seen.actions';
import { removeCurrentUser } from '../state/actions/users.action';
import { Bookmark, Follow, jobPostModel, jobRequest } from './model/typescriptModel/jobPost.model';
import { UtilService } from './service/util.service';
import { User } from '../model/user.model';
import { UserServiceService } from './service/user-service.service';
import { requestView } from './model/typescriptModel/users.model';
import { Unsubscribe } from 'firebase/firestore';
import { Auth, user,sendEmailVerification } from '@angular/fire/auth';
import { PharmaProfileComponent } from './page/pharma-profile/pharma-profile.component';
import * as _ from 'lodash';
declare var window: any;


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  private auth: Auth = inject(Auth);
  address: any = {}
  loginFlag: boolean = false;
  subject!: Subscription;
  user!: User;
  emailVerifiedFlag: boolean = true
  requestView: requestView = {
    operatorUID: '',
    userUID: '',
    requestView: '',
    dateSent: '',
    status: ''
  }
  i: number = 0;
  parsedJobs: jobPostModel[] = []
  subscription: any = {};
  formModal!: any;
  offCanvas: any;
  bookmarkSubscription: {
    [key:string]:Unsubscribe
  } = {}
constructor(private pharmaProfileComponent: PharmaProfileComponent, private userService: UserServiceService, private activatedRoute:ActivatedRoute,private jobService:JobPostService, private store: Store ,private route: Router,  private utilService:UtilService) {
  
}

ngOnInit(){  
  this.formModal = new window.bootstrap.Modal(
    document.getElementById('requestViewModal')
  );
  this.offCanvas = new window.bootstrap.Offcanvas(
    document.getElementById('offcanvasExample')
  )
  this.store.select((state: any)=>{
    return state.user
  }).subscribe((user)=>{
    this.user = _.cloneDeep(user)
    if(this.user.cropProfilePictureUrl == ''){
      delete this.user.cropProfilePictureUrl
    }
  })
  this.store.select((state: any)=>{
    return state.recentlySeen
  }).subscribe((recentlySeen)=>{
    if(recentlySeen.length > 10){
      this.store.dispatch(removeRecentlySeen());
    }
  })
  this.subject = user(this.auth).subscribe((user)=>{
    if(user){
      this.jobService.getUserBookmark(user.uid).then((bookmarks)=>{
          bookmarks.forEach((bookmark: Bookmark)=>{
            this.bookmarkSubscription[bookmark.jobUID] = this.jobService.getJobFromBookmark(bookmark) as Unsubscribe
          })
      })
      this.userService.getRequestView(user.uid)
      this.utilService.getRemoveBookmarkSubject().subscribe((value:any)=>{
        this.bookmarkSubscription[value.jobUID]();
        delete this.bookmarkSubscription[value.jobUID];
      })
      this.utilService.getListenJobBookmark().subscribe((value: Bookmark)=> {
        this.bookmarkSubscription[value.jobUID] = this.jobService.getJobFromBookmark(value)
      })
      
      this.jobService.getFollowers(user.uid).then((followers:any)=>{
        followers = followers.docs.map((follower:any)=> {
          return {
            ...follower.data(),
            followUID:follower.id
          }
        })
        let followIDList = followers.map((request:Follow)=>{return request.operatorUID})
        this.jobService.getOperatorFromFollows(followIDList).then((operators)=>{
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
      this.jobService.getRequestJob(user.uid).then((requestedJobs:any)=>{
        requestedJobs = requestedJobs.docs.map((requestedJob:any)=> {
          return {
            ...requestedJob.data(),
            custom_doc_id:requestedJob.id
          }
        }) as jobRequest[]
        let jobIDList:string[] = requestedJobs.map((request:any)=>{return request.jobUID})
        jobIDList.forEach((jobUID:string)=>{
          let payload = requestedJobs.find((jobRequest:any)=>{
            return jobRequest.jobUID == jobUID
          })
          this.subscription[jobUID] = this.jobService.getJobFromJobRequest(jobUID, payload)
        })
      })
      this.utilService.getRemoveRequestSubject().subscribe((value:any)=>{
        this.subscription[value]();
        delete this.subscription[value]
      })
      this.utilService.getListenJobRequest().subscribe((value: any)=> {
        this.subscription[value.jobUID] = this.jobService.getJobFromJobRequest(value.jobUID, value)
      })
    }else{
      this.store.dispatch(EmptyJobPostAppState());
    }
    this.loginFlag = (localStorage.getItem('loginState') === null || localStorage.getItem('loginState') === 'false')? false: true 
    this.route.navigate(['pharma']);
  })
  this.loginFlag = true;
  this.loginFlag = (localStorage.getItem('loginState') === null || localStorage.getItem('loginState') === 'false')? false: true 
  this.utilService.getRequestViewSubject().subscribe((requestView: requestView)=>{
    this.requestView = requestView
    this.formModal.show()
  })
}

goRegister(isPharma: boolean){
  this.route.navigate(['/pharma/register'], {
    queryParams: 
    {
      isPharma: isPharma
    }
  })
}

sendVerificationEmail(){
  sendEmailVerification(this.auth.currentUser!)
}

randomTime(start:Date, end:Date): Date {
  let diff =  end.getTime() - start.getTime();
  let new_diff = diff * Math.random();
  let date = new Date(start.getTime() + new_diff);
  return date
}


onClose(){
  this.formModal.hide()
}
goToConfirm(){
  this.route.navigate(['confirm']);
}
goToPage(page: string, queryFlag = false, queryParams:any = {}){
  let splitTarget = page.split('/')
  let finalTarget = ''
  if(this.route.url.indexOf('profile-pharma') !== -1){
    if(this.route.url.indexOf('register-jobs') !== -1){
      this.pharmaProfileComponent.setChildFlag(true)
    }else{
      this.pharmaProfileComponent.setChildFlag(false)
    }
    if(page.indexOf('profile-pharma') !== -1){
      finalTarget = splitTarget[splitTarget.length-1]
      this.pharmaProfileComponent.selectTab(finalTarget)
    }
  }
  this.offCanvas.hide()
  if(!queryFlag){
    this.route.navigate(['pharma/' + page]).then(()=>{
    })
  }else{
    this.route.navigate(['pharma/' + page],
      {
        queryParams:queryParams
      }).then(()=>{
      this.offCanvas.hide()
    })
  }
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
    let element = document.getElementById(categorySymbol + "toScroll")!
    element.scrollIntoView({ block: "start" });
    setTimeout(() => {
      this.offCanvas.hide()
    }, 1000)
  }
  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }


}

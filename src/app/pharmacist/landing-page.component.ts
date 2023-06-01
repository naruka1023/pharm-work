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
import { Auth, user } from '@angular/fire/auth';
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
constructor(private userService: UserServiceService, private activatedRoute:ActivatedRoute,private jobService:JobPostService, private store: Store ,private route: Router,  private utilService:UtilService) {
  
}

ngOnInit(){  
  this.formModal = new window.bootstrap.Modal(
    document.getElementById('requestViewModal')
  );
  this.offCanvas = new window.bootstrap.Offcanvas(
    document.getElementById('offcanvasExample')
  )
  // this.db.collection('job-post', ref=> ref.where('CategorySymbol', '!=', 'AA')).get().subscribe((docs)=>{
  //   let possibleSalaries = [15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000]
  //   let possibleCap = [1000,2000,3000,4000,5000,6000,7000,8000,9000,10000]
  //   let boolean = [true, false]
  //   docs.forEach((doc:any)=>{
  //     let newDoc = doc.data();
  //       let randomDate = this.randomTime(new Date('1/1/2020'), new Date('1/1/2023'))
  //       newDoc.dateUpdated = randomDate.toISOString().split('T')[0]
  //       newDoc.dateUpdatedUnix = Math.floor(randomDate.getTime() / 1000)
  //     this.db.collection('job-post').doc(doc.id).set(newDoc).then(()=>{
  //       console.log(`update ${doc.id} successful`)
  //     })
  //   })
  // })
      // this.db.collection("users", ref => ref.where('role', '==', "ผู้ประกอบการ")).get().subscribe((docs) =>{
      //   docs.forEach((doc:any)=>{
      //     let newText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      //     let newDocData: UserPharma = doc.data();
      //     newDocData.introText = newText
      //     this.db.collection("users").doc(doc.id).update(newDocData).then((newDoc: any)=>{
      //       console.log(`updatedSuccessfully`)
      //     })
      //   })
      // })
  this.store.select((state: any)=>{
      this.user = state.user;
    return state.recentlySeen
  }).subscribe((recentlySeen)=>{
    if(recentlySeen.length > 10){
      this.store.dispatch(removeRecentlySeen());
    }
  })
  this.subject = user(this.auth).subscribe((user: any)=>{
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
  })
  this.loginFlag = true;
  this.loginFlag = (localStorage.getItem('loginState') === null || localStorage.getItem('loginState') === 'false')? false: true 
  this.utilService.getRequestViewSubject().subscribe((requestView: requestView)=>{
    this.requestView = requestView
    this.formModal.show()
  })
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

goToPage(page: string, queryFlag = false, queryParams:any = {}){
  if(!queryFlag){
    this.route.navigate(['pharma/' + page]).then(()=>{
      this.offCanvas.hide()
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
    this.offCanvas.hide()
  }
  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }


}

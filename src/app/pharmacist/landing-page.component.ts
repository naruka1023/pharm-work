import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { JobPostService } from './service/job-post.service';
import { updateFollowersList, EmptyJobPostAppState, removeJobRequest, setBanner } from './state/actions/job-post.actions';
import { removeRecentlySeen } from './state/actions/recently-seen.actions';
import { removeCurrentUser, setCurrentUser } from '../state/actions/users.action';
import { Bookmark, Follow, jobPostModel, jobRequest, userOperator } from './model/typescriptModel/jobPost.model';
import { UtilService } from './service/util.service';
import { User } from '../model/user.model';
import { UserServiceService } from './service/user-service.service';
import { aggregationCount, notificationContent, requestView } from './model/typescriptModel/users.model';
import { Auth, user,sendEmailVerification } from '@angular/fire/auth';
import { PharmaProfileComponent } from './page/pharma-profile/pharma-profile.component';
import * as _ from 'lodash';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { Firestore, collection, getDocs, query, where, Unsubscribe, doc, onSnapshot, updateDoc, addDoc } from '@angular/fire/firestore';
import { Messaging, onMessage } from '@angular/fire/messaging';
import { NotificationsComponent } from './common/notifications/notifications.component';
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
  notificationsArchive: notificationContent[] = []
  requestView: requestView = {
    operatorUID: '',
    userUID: '',
    requestView: '',
    dateSent: '',
    status: ''
  }
  copy: string = 'Copy'
  idToShare: string = ''
  nameToShare: string = ''
  aggregationGroup: aggregationCount = {
    jobCount: 0,
    userOperatorCount: 0,
    userPharmaCount: 0
  }
  shareModal!: any;
  i: number = 0;
  parsedJobs: jobPostModel[] = []
  subscription: {
    [key:string]:Unsubscribe
  } = {} as any
  formModal!: any;
  loginModal!: any;
  registerModal!: any
  offCanvas: any;
  operatorModal: any;
  jobPostUID?: string
  notificationsFlag?: any 
  successCheckoutFlag?: any 
  cancelCheckoutFlag?: any 
  type!: string 
  bookmarkSubscription: {
    [key:string]:Unsubscribe
  } = {}
  landingFlag: boolean = true
  registerType: string | null = ''
  constructor(private meta: Meta, private notificationsComponent: NotificationsComponent,private pharmaProfileComponent: PharmaProfileComponent, private userService: UserServiceService, private activatedRoute:ActivatedRoute,private jobService:JobPostService, private store: Store ,private route: Router,  private utilService:UtilService) {
  }
  private _messaging = inject(Messaging);
  private firestore = inject(Firestore)
  ngOnInit(){  
    this.notificationsFlag = this.activatedRoute.snapshot.queryParamMap.get('notificationsFlag') 
    this.landingFlag = Boolean(this.activatedRoute.snapshot.queryParamMap.get('landingFlag'))
    this.notificationsFlag = this.notificationsFlag == 'true'?true:false
  if(this.notificationsFlag){
    const payload = this.activatedRoute.snapshot.queryParamMap.get('url')!  
    this.jobPostUID = payload.split('=')[1]  
    this.type = payload.split('=')[0]
    localStorage.setItem('type', this.type)
    localStorage.setItem('jobUID', this.jobPostUID)
  }else{
    localStorage.removeItem('type')
    localStorage.removeItem('jobUID')
  }
  this.shareModal = new window.bootstrap.Modal(
    document.getElementById('shareModal')
  );
  this.formModal = new window.bootstrap.Modal(
    document.getElementById('requestViewModal')
  );

  this.loginModal = new window.bootstrap.Modal(
    document.getElementById('loginModal')
  );
  this.registerModal = new window.bootstrap.Modal(
    document.getElementById('registerModal')
  );
  this.operatorModal = new window.bootstrap.Modal(
    document.getElementById('operatorModal')
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
  this.store.select((state:any)=>{
    return state.notifications.notificationsArchive
  }).subscribe((notificationArchive)=>{
    let temp: notificationContent[]= []
    Object.keys(notificationArchive).map((key)=> {
      temp.push(notificationArchive[key])
    })
    this.notificationsArchive = temp
    const currentDate: Date = new Date()
    this.notificationsArchive = this.notificationsArchive.map((notification)=>{
      const notificationDate: Date = new Date(notification.dateCreated)
      let difference = (currentDate.valueOf() - notificationDate.valueOf())/1000
      const objectTime: {
        [key: string]: number
      } = {
        seconds: difference,
        minutes: difference/60,
        hours: difference/3600,
        days: difference/(3600*24),
        months: difference/(3600*24*31),
        years: difference/(3600*24*31*12)
      }
      // วินาทีที่แล้ว
      // นาทีที่แล้ว
      // ชั่วโมงที่แล้ว
      // วันที่แล้ว

      let currentKey = ''
      let currentValue = 0
      Object.keys(objectTime).forEach((key)=>{
        if(objectTime[key] >= 1){
          currentKey = key
          currentValue = Math.floor(objectTime[key])
        }
      })
      let finalMessage = ''
      switch(currentKey){
        case 'seconds':
          finalMessage = currentValue + ' วินาทีที่แล้ว'
          break;
        case 'minutes':
          finalMessage = currentValue + ' นาทีที่แล้ว'
          break;
        case 'hours':
          finalMessage = currentValue + ' ชั่วโมงที่แล้ว'
          break;
        case 'days':
          finalMessage = currentValue + ' วันที่แล้ว'
          break;
        case 'months':
          finalMessage = currentValue + ' เดือนที่แล้ว'
          break;
        case 'years':
          finalMessage = currentValue + ' ปีที่แล้ว'
          break;
      }
      return {
        ...notification,
        dateRange: finalMessage
      }
    })
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
      onMessage(this._messaging,(payload)=>{
        this.appendAlert({
          ...payload.notification,
          image: payload.data!['image']
        },'light', this.i)
        this.i++
      })
      this.userService.getCountGroup().then((aggregation)=>{
        this.aggregationGroup = aggregation
      })
      this.userService.getNotifications(user.uid)
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
      onSnapshot(query(collection(this.firestore, 'users'), where('uid', '==', user.uid)), (snapshot) =>{
        snapshot.docChanges().forEach((value)=>{
          if(value.type == 'modified'){
            const data = value.doc.data() as User
            this.store.dispatch(setCurrentUser({
              user:{showProfileFlag: data.showProfileFlag, active: data.active}
            }))
          }
        })
      })
      onSnapshot(query(collection(this.firestore, 'job-request'), where('userUID', '==', user.uid)), (jobRequest)=>{
        return jobRequest.docChanges().map((value)=>{
          let requestJobPayload = {
            payload: {
              ...value.doc.data() as jobRequest,
              custom_doc_uid: value.doc.id
            },
            type: value.type
          }
          switch(value.type){
            case 'added':
              this.subscription[requestJobPayload.payload.jobUID] = this.jobService.getJobFromJobRequest(requestJobPayload.payload.jobUID, requestJobPayload.payload)
              break;
            case 'removed':
              this.store.dispatch(removeJobRequest({jobRequest:{
                ...requestJobPayload.payload,
              }}))
              this.subscription[requestJobPayload.payload.jobUID]();
              delete this.subscription[requestJobPayload.payload.jobUID]
              break;
          }
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
      this.userService.getCountGroup().then((aggregation)=>{
        this.aggregationGroup = aggregation
      })
      this.store.dispatch(EmptyJobPostAppState());
    }
    this.loginFlag = (localStorage.getItem('loginState') === null || localStorage.getItem('loginState') === 'false')? false: true 
    // this.route.navigate(['pharma']);
  })
  if(this.landingFlag){
    this.registerModal.show()
  }
  this.loginFlag = true;
  this.loginFlag = (localStorage.getItem('loginState') === null || localStorage.getItem('loginState') === 'false')? false: true 
  this.utilService.getRequestViewSubject().subscribe((requestView: requestView)=>{
    this.requestView = requestView
    this.formModal.show()
  })
  
  
}
updateShowProfile(){
  if(!this.user.showProfileFlag){
    this.store.dispatch(setCurrentUser({user:{showProfileFlag: true}}))
    this.userService.updateUser({
      showProfileFlag: true,
      uid: this.user.uid
    })
  }
}
appendAlertfromOutside(message: any){
  this.appendAlert(message, 'light', this.i)
  this.i++
  updateDoc(doc(this.firestore, 'users/' + this.user.uid), {
    showProfileFlag: false
  })
  addDoc(collection(this.firestore, 'notification-archive'), {
      userUID: this.user.uid,
      body: message.body,
      title:message.title,
      image: message.image,
      url: message.url,
      newFlag: true
  })
}
onCloseModal(){
  this.operatorModal.hide()
}
appendAlert(message: any, type: any, i: number){
  const alertPlaceholder = document.getElementById('liveAlertPlaceholder')!
  const localIndex = i
  const wrapper = document.createElement('div')
  wrapper.setAttribute('id', 'myAlert' + i);
  wrapper.classList.add('semi-border-input')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} mb-0 d-flex alert-dismissible textResponsive align-items-center" role="alert">`,
    `   
        <div><img src=${message.image} width=100 height=100 class="notificationImage me-3"/></div>  
        <div>
          <div class="mb-3">
            <b>${message.title}</b>
          </div>
          <div class="mb-3">
          ${message.body == undefined? '': message.body}
          </div>
        </div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
  // setTimeout(()=>{
  //   const dom = document.getElementById('myAlert' + i)
  //   const alert = window.bootstrap.Alert.getOrCreateInstance(dom)
  //   alert.close()
  // }, 5000)
}

goToHome(){
  localStorage.removeItem('type')
  localStorage.removeItem('jobUID')
  this.route.navigate(['pharma'])
}

goToNotificationsFromAlert(url: string){
  const payload = url.split('/')[url.split('/').length-1].split('?')[1].split('=')
  this.route.navigate(['notifications'], {
    relativeTo: this.activatedRoute,
    queryParams:{
      jobUID: payload[1],
      type: payload[0]
    }
  })
}

goToNotifications(url: string, notificationID: string){
  this.store.dispatch(setCurrentUser({user:{showProfileFlag: true}}))
  this.userService.updateNotifications({
    notificationID: notificationID,
    newFlag: false
  })
  const payload = url.split('/')[url.split('/').length-1].split('?')[1].split('=')
  if(this.route.url.includes('notifications')){
    this.notificationsComponent.initNoti(payload[1], payload[0])
  }else{
    this.route.navigate(['notifications'], {
      relativeTo: this.activatedRoute,
      queryParams:{
        jobUID: payload[1],
        type: payload[0]
      }
    })
  }
}

toggleShare(jobPost: jobPostModel){
  this.idToShare = jobPost.custom_doc_id
  this.nameToShare = 'https://public.pharm-work.com/job-post/' + this.idToShare 
  this.copy = 'Copy'
  this.shareModal.show()
}

goRegister(isPharma: boolean){
  this.route.navigate(['/pharma/register'], {
    queryParams: 
    {
      isPharma: isPharma
    }
  })
}

onLoginClick(){
  this.operatorModal.hide()
  const triggerEl :any = document.querySelector('#myTab button[data-bs-target="#urgent-job-pane-login"]')
  triggerEl!.click()
  this.loginModal.show()
}

onRegisterClick(){
  const triggerEl :any = document.querySelector('#myTab2 button[data-bs-target="#urgent-job-pane"]')
  triggerEl!.click()
  this.operatorModal.hide()
  this.registerModal.show()
}

copyString() {
  // Get the text field
  const copyText: any = document.getElementById("myInput")!;

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

   // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value)
  this.copy = "Copied"
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
    if(this.route.url.indexOf('profile-pharma') !== -1){
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

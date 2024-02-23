import { AfterViewInit, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, from, map } from 'rxjs';
import { removeCurrentUser, setCurrentUser } from '../state/actions/users.action';
import { UsersService } from './service/users.service';
import { emptyRequestedJobs } from './state/actions/job-request-actions';
import { removeRecentlySeen } from './state/actions/recently-seen.actions';
import { clearFavorites, setFavorites } from './state/actions/users-actions';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UtilService } from './service/util.service';
import { User, UserPharma, aggregationCount, notificationContent, requestView } from './model/user.model';
import { addRequestView } from './state/actions/request-view.actions';
import { Auth, sendEmailVerification, user } from '@angular/fire/auth';
import { Firestore, collection, getDocs, query, updateDoc, doc, where, addDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import _ from 'lodash';
import { OperatorProfileComponent } from './page/operator-profile/operator-profile.component';
import { RequestJobComponent } from './page/operator-profile/request-job/request-job.component';
import moment from 'moment';
import { url } from 'src/environments/environment';
import { Messaging, onMessage } from '@angular/fire/messaging';
declare let window: any;

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements AfterViewInit {
  addJobConfirmModal: any
  display: any;
  private auth: Auth = inject(Auth)
  private _messaging:Messaging = inject(Messaging)
  private db: Firestore = inject(Firestore)
  googleMapLoadingFlag: boolean = false
  subject!:Subscription
  requestViewForm!: FormGroup
  idToShare: string = ''
  nameToShare!: string
  user!: User;
  followFlag: boolean = true;
  copy: string = 'Copy'
  emailVerifiedFlag: boolean = true
  aggregationGroup: aggregationCount = {
    jobCount: 0,
    userOperatorCount: 0,
    userPharmaCount: 0
  }
  i: number = 0
  accuracy!: number;
  _geoLoc: any;
  zoom: number = 15
  submitted: boolean = false
  none: google.maps.MapOptions = {
    gestureHandling:'greedy'
  };
  center: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  }
  geoLocFlag!: boolean
  googleMapModal: any;
  content!: UserPharma
  requestViewLoadingFlag = false;
  formModal!: any;
  requestViewEditor = ClassicEditor;
  operatorUID!: string;
  googleMapForm!: FormGroup; 
  userUID!: string;
  requestViewModel = {
    editorData: ''
  };
  addJobModal!: any
  jobPostUID?: string
  type!: string 
  shareModal!: any
  offCanvas!: any
  notificationsFlag?: any 
  notificationsArchive: notificationContent[] = []

  constructor(private activatedRoute: ActivatedRoute,private requestJobsComponent:RequestJobComponent, private operatorProfileComponent: OperatorProfileComponent,private utilService: UtilService, private fb: FormBuilder, private userService: UsersService,  private route:Router, private store:Store){}
  
  ngOnInit(){
    this.initializeGoogleMapForm()
    onMessage(this._messaging, (payload)=>{
      console.log(payload)
    })
    this.store.select((state:any)=>{
      return state.notifications.notificationsArchive
    }).subscribe((notificationArchive)=>{
      let temp: notificationContent[]= []
      Object.keys(notificationArchive).map((key)=> {
        temp.push(notificationArchive[key])
      })
      this.notificationsArchive = temp
    })
    this.notificationsFlag = this.activatedRoute.snapshot.queryParamMap.get('notificationsFlag') 
    this.notificationsFlag = this.notificationsFlag == 'true'?true:false
  if(this.notificationsFlag){
    this.jobPostUID = this.activatedRoute.snapshot.queryParamMap.get('url')!  
    let payload = this.jobPostUID.split('?')[this.jobPostUID.split('?').length - 1]
    this.jobPostUID = payload.split('=')[1]
    this.type = payload.split('=')[0]
    localStorage.setItem('type', this.type)
    localStorage.setItem('jobUID', this.jobPostUID)
  }else{
    localStorage.removeItem('type')
    localStorage.removeItem('jobUID')
  }
    this.addJobConfirmModal = new window.bootstrap.Modal(
      document.getElementById('addJobConfirmModal')
    )
    this.googleMapModal = new window.bootstrap.Modal(
      document.getElementById('googleMapModal')
    );
    document.getElementById('googleMapModal')?.addEventListener('hidden.bs.modal', ()=>{
      this.initializeGoogleMapForm()
    })
    this.offCanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasExample')
    )
    this.shareModal = new window.bootstrap.Modal(
      document.getElementById('shareModal')
    )
    this.addJobModal = new window.bootstrap.Modal(
      document.getElementById('addJobModal')
    )
    
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('requestViewModal')
    );
      this.store.select((state: any)=>{
        return state.user
      }).subscribe((user)=>{
        this.user = _.cloneDeep(user)
        if(this.user.cropProfilePictureUrl == ''){
          delete this.user.cropProfilePictureUrl
        }
      })
      user(this.auth).subscribe((user)=>{
        if(user){
          onMessage(this._messaging,(payload)=>{
            this.appendAlert(payload.notification,'light', this.i, payload.fcmOptions!.link!)
            this.i++
          })
          this.emailVerifiedFlag = user.emailVerified
          this.store.select((state: any)=>{
          return state.recentlySeen
        }).subscribe((recentlySeen: any)=>{
          if(recentlySeen.length > 10){
            this.store.dispatch(removeRecentlySeen());
          }
        })
        this.userService.getNotifications(user.uid)
        this.store.select((state: any)=>{
          return {
            followers: state.user.followers,
            uid: state.user.uid
          }
        }).subscribe((followers: any)=>{
          this.operatorUID = followers.uid
          if(this.followFlag){
            this.followFlag = !this.followFlag
            this.userService.getNumberOfFollowers(followers.uid).then((number: number)=>{
              const payload: any = {
                followers: number
              }
              this.store.dispatch(setCurrentUser({user:payload}))
            })
          }
        })
        this.userService.getRequestView(user.uid)
        
        this.userService.getFavorites(user.uid).then((favorites1: any)=>{
          this.userService.getListOfUsersFromFavorites(favorites1).then((favorites)=>{
            this.store.dispatch(setFavorites({favorites:favorites as any}))
          })
        })
        onSnapshot(query(collection(this.db, 'users'), where('uid', '==', user.uid)), (snapshot) =>{
          snapshot.docChanges().forEach((value)=>{
            if(value.type == 'modified'){
              const data = value.doc.data() as User
              this.store.dispatch(setCurrentUser({
                user:{showProfileFlag: data.showProfileFlag}
              }))
            }
          })
        })
      }else{
        this.store.dispatch(clearFavorites());
        this.store.dispatch(emptyRequestedJobs());
      }
      this.utilService.getGoogleMapSubject().subscribe((googleMap)=>{
        this.openGoogleMapModal(googleMap)
      })
      this.utilService.getRequestViewSubject().subscribe((user: UserPharma)=>{
        this.content = user
        this.userUID = user.uid
        this.formModal.show()
      })
    })
    this.initializeFormGroup()
    document.getElementById('googleMapModal')?.addEventListener('hide.bs.modal', ()=>{
      this.utilService.sendRevertGoogleMapSubject()
    })
  }
  
  selectAddJob(activeFlag: boolean){
    this.closeAddJobConfirmModal()
    this.utilService.sendConfirmAddJobSubject(activeFlag)
  }
  openAddJobConfirmModal(){
    this.addJobConfirmModal.show()
  }
  
  closeAddJobConfirmModal(){
    this.addJobConfirmModal.hide()
  }
  openAddModal(){
    this.addJobModal.show()
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
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

  goToNotifications(url: string, notificationID: string){
    this.store.dispatch(setCurrentUser({user:{showProfileFlag: true}}))
    this.userService.updateNotifications({
      notificationID: notificationID,
      newFlag: false
    })
    const payload = url.split('/')[url.split('/').length-1].split('?')[1].split('=')
    this.route.navigate(['notifications'], {
      relativeTo: this.activatedRoute,
      queryParams:{
        userUID: payload[1],
        type: payload[0]
      }
    })
  }
  
  appendAlert(message: any, type: any, i: number, link: string){
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')!
    const localIndex = i
    const wrapper = document.createElement('div')
    wrapper.setAttribute('id', 'myAlert' + i);
    wrapper.classList.add('semi-border-input')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} mb-0 d-flex alert-dismissible textResponsive align-items-end" role="alert">`,
      `   
          <div><img src=${message.image} width=150 height=150 class="me-3"/></div>  
          <div>
            <div class="mb-3">
              <b>${message.body}</b>
            </div>
            <div class="mb-3">
              ${message.title}
            </div>
          </div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
  
    alertPlaceholder.append(wrapper)
    setTimeout(()=>{
      const dom = document.getElementById('myAlert' + i)
      const alert = window.bootstrap.Alert.getOrCreateInstance(dom)
      alert.close()
    }, 5000)
  }

moveMap(event: any){
  this.markerPosition = {
    lat: event.latLng.lat(),
    lng: event.latLng.lng()
  }
  this.center = this.markerPosition
  this.googleMapForm.patchValue({_geoloc: this.markerPosition})
}

  
  openGoogleMapModal(geoLoc: any){
    this.center = geoLoc
    this.markerPosition = geoLoc
    this.googleMapModal.show()
  }

    
  onSaveGoogleMap(){
    this.googleMapLoadingFlag = true
    const payload = {
      ...this.googleMapForm.value,
      uid: this.user.uid
    }
    this.utilService.updateUser(payload).then(()=>{
      this.googleMapLoadingFlag = false;
      this.store.dispatch(setCurrentUser({user: payload}))
      this.googleMapModal.hide()
    })
    
  }

  onCloseGoogleMap(){
    this.googleMapModal.hide()
  }
  
searchMap(event: any){
  this.markerPosition = {
    lat: event.geometry.location.lat(),
    lng: event.geometry.location.lng()
  }
  this.center = this.markerPosition
  this.googleMapForm.patchValue({_geoloc: this.markerPosition})
}

get getGoogleMapForm(): { [key: string]: AbstractControl } {
  return this.googleMapForm.controls;
}

initializeGoogleMapForm(){
  this.googleMapForm = this.fb.group({
    _geoloc: ['', [Validators.required]],
  })
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

  ngAfterViewInit(): void {
    this.userService.getCountGroup().then((aggregations)=>{
      this.aggregationGroup = aggregations
    })
  }
  toggleShare(id: string){
    this.idToShare = id
    this.nameToShare = url.shareJob + this.idToShare 
    this.copy = 'Copy'
    this.shareModal.show()
  }

  goToPage(page: string, isRequestView: boolean = false, scrollFlag: boolean = false){
    const newPage = page.indexOf('?') !== -1? page.split('?')[0]: page
    const splitTarget = newPage.split('/')
    let finalTarget = ''
    if(page.indexOf('profile-operator') !== -1){
      finalTarget = splitTarget[splitTarget.length-1]
      this.operatorProfileComponent.selectTab(finalTarget)
    }
    this.offCanvas.hide()
    if(!scrollFlag){
      if(isRequestView){
        this.route.navigate(['operator/' + page], {
          queryParams: 
          {
            isRequestView: isRequestView
          }
        }).then(()=>{
          this.offCanvas.hide()
          if(page.indexOf('profile-operator') !== -1){
            this.requestJobsComponent.selectTab('private-profile')
          } 
        })
        
      }else{
        this.route.navigate(['operator/' + page]).then(()=>{
          if(page.indexOf('profile-operator') !== -1){
            this.requestJobsComponent.selectTab('main-profile')
          } 
          this.offCanvas.hide()
        })
      }
    }else{
      this.route.navigate(['operator/' + page], {
        queryParams: 
        {
          scrollFlag: true
        }
      }).then(()=>{
        this.offCanvas.hide()
        if(page.indexOf('profile-operator') !== -1){
          this.requestJobsComponent.selectTab('private-profile')
        } 
      })
    }
  }

  sendVerificationEmail(){
    sendEmailVerification(this.auth.currentUser!)
  }

  onSave() {
    let request: requestView = {
      operatorUID: this.operatorUID,
      userUID: this.userUID,
      requestView: this.requestViewForm.value.requestView,
      dateSent: moment(new Date).format('yyyy-MM-DD'),
      status: 'Pending'
    }
    this.requestViewLoadingFlag = true
    this.userService.createRequestView(request).then((rQt)=>{
      this.initializeFormGroup();
      request = {
        ...request,
        content: this.content,
        requestViewUID: rQt.id
      }
      this.store.dispatch(addRequestView({requestView:request}))
      this.requestViewLoadingFlag = false
      this.onClose()
    })
  }
  onClose(){
    this.initializeFormGroup();
    this.formModal.hide()
  }
  initializeFormGroup(){
    this.requestViewForm = this.fb.group({
      requestView:[''],
    });
  }

  goToAddJob(event: any, urgencyFlag:boolean) {
    if(event.target.className.indexOf('question') == -1){
      event.preventDefault()
      this.route.navigate(['/operator/add-new-jobs'], {
        queryParams: 
        {
          urgency: urgencyFlag
        }
      }).then(()=>{
        this.addJobModal.hide()
        this.offCanvas.hide()
      })
    }else{
      this.offCanvas.hide()
    }
  }
  signOut(){
    if(this.route.url == '/operator') {
      this.route.navigate(['operator']).then(()=>{
          this.confirmSignout();
      })
    }else{
      this.route.navigate(['pharma']).then((bool:boolean)=>{
        if(bool){
          this.confirmSignout();
        }
      })
    }
  }
  
  confirmSignout(){
    this.auth.signOut().then(()=>{
      this.store.dispatch(removeCurrentUser());
      location.reload()
    });
  }
}

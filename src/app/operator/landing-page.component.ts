import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, from, map } from 'rxjs';
import { removeCurrentUser, setCurrentUser } from '../state/actions/users.action';
import { UsersService } from './service/users.service';
import { emptyRequestedJobs } from './state/actions/job-request-actions';
import { removeRecentlySeen } from './state/actions/recently-seen.actions';
import { clearFavorites, setFavorites } from './state/actions/users-actions';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UtilService } from './service/util.service';
import { User, UserPharma, requestView } from './model/user.model';
import { addRequestView } from './state/actions/request-view.actions';
import { Auth, sendEmailVerification, user } from '@angular/fire/auth';
import { Firestore, collection, getDocs, query, updateDoc, doc, where } from '@angular/fire/firestore';
import _ from 'lodash';
import { jobPostModel } from './model/jobPost.model';
import { OperatorProfileComponent } from './page/operator-profile/operator-profile.component';
import { RequestJobComponent } from './page/operator-profile/request-job/request-job.component';
declare var window: any;

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  private auth: Auth = inject(Auth)
  subject!:Subscription
  requestViewForm!: FormGroup
  user!: User;
  followFlag: boolean = true;
  emailVerifiedFlag: boolean = true
  content!: UserPharma
  requestViewLoadingFlag = false;
  formModal!: any;
  requestViewEditor = ClassicEditor;
  operatorUID!: string;
  userUID!: string;
  requestViewModel = {
    editorData: ''
  };
  offCanvas!: any

  constructor(private requestJobsComponent:RequestJobComponent, private operatorProfileComponent: OperatorProfileComponent,private utilService: UtilService, private fb: FormBuilder, private userService: UsersService,  private route:Router, private store:Store){}


  ngOnInit(){
    this.offCanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasExample')
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
        this.emailVerifiedFlag = user.emailVerified
        this.store.select((state: any)=>{
          return state.recentlySeen
        }).subscribe((recentlySeen: any)=>{
          if(recentlySeen.length > 10){
            this.store.dispatch(removeRecentlySeen());
          }
        })
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
              let payload: any = {
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
      }else{
        this.store.dispatch(clearFavorites());
        this.store.dispatch(emptyRequestedJobs());
      }
      this.utilService.getRequestViewSubject().subscribe((user: UserPharma)=>{
        this.content = user
        this.userUID = user.uid
        this.formModal.show()
      })
    })
    this.initializeFormGroup()
  }

  goToPage(page: string, isRequestView: boolean = false, scrollFlag: boolean = false){
    let newPage = page.indexOf('?') !== -1? page.split('?')[0]: page
    let splitTarget = newPage.split('/')
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
      dateSent: new Date().toISOString().split('T')[0],
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

  goToAddJob(urgencyFlag:boolean) {
    this.route.navigate(['/operator/add-new-jobs'], {
      queryParams: 
      {
        urgency: urgencyFlag
      }
    }).then(()=>{
      this.offCanvas.hide()
    })
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
    this.auth.signOut();
    this.store.dispatch(removeCurrentUser());
  }
}

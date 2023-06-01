import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { removeCurrentUser, setCurrentUser } from '../state/actions/users.action';
import { UsersService } from './service/users.service';
import { emptyRequestedJobs } from './state/actions/job-request-actions';
import { removeRecentlySeen } from './state/actions/recently-seen.actions';
import { clearFavorites, setFavorites } from './state/actions/users-actions';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UtilService } from './service/util.service';
import { UserPharma, requestView } from './model/user.model';
import { addRequestView } from './state/actions/request-view.actions';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, collection, getDocs, query, updateDoc, doc, where } from '@angular/fire/firestore';
import _ from 'lodash';
import { jobPostModel } from './model/jobPost.model';
declare var window: any;

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  private auth: Auth = inject(Auth)
  private db: Firestore = inject(Firestore)
  subject!:Subscription
  requestViewForm!: FormGroup
  followFlag: boolean = true;
  content!: UserPharma
  requestViewLoadingFlag = false;
  formModal!: any;
  requestViewEditor = ClassicEditor;
  operatorUID!: string;
  userUID!: string;
  requestViewModel = {
    editorData: ''
  };
  

  constructor(private utilService: UtilService, private fb: FormBuilder, private userService: UsersService,  private route:Router, private store:Store){}


  ngOnInit(){
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('requestViewModal')
      );
      user(this.auth).subscribe((user)=>{
      //   let dummyDates = [{lat: 13.727212058701708, lng: 100.60111999511719},
      //   {lat: 13.722574300952632, lng: 100.5950178872358},
      //   {lat: 13.712401633355013, lng: 100.58128497707955},
      //   {lat: 13.702395300858113, lng: 100.59973857510201},
      //   {lat: 13.74141758534968, lng: 100.57124278652779},
      //   {lat: 13.756174320854887, lng: 100.57514808285347},
      //   {lat: 13.750338434927897, lng: 100.59051177609078},
      //   {lat: 13.722657681652075, lng: 100.57008407223336},
      //   {lat: 13.741500959348368, lng: 100.54982802975289},
      //   {lat: 13.761843327844433, lng: 100.5754055749189},
      //   {lat: 13.763010459291234, lng: 100.60072562801949},
      //   {lat: 13.748722870755335, lng: 100.63854217529297},
      //   {lat: 13.746003111215812, lng: 100.64619156348991},
      //   {lat: 13.709149622048935, lng: 100.65185638892936},
      //   {lat: 13.681630801863198, lng: 100.60911270606803},
      //   {lat: 13.675344552820276, lng: 100.58755874633789},
      //   {lat: 13.72982831093724, lng: 100.58086395263672},
      //   {lat: 13.674010189525355, lng: 100.53314208984375},
      //   {lat: 13.81652550905189, lng: 100.57537078857422},
      //   {lat: 13.781850489424423, lng: 100.57382583618164},
      //   {lat: 13.701478032388431, lng: 100.71807678317168},
      //   {lat: 13.759029172168233, lng: 100.56529093854516},
      //   {lat: 13.758627587856235, lng: 100.56502334621774},
      //   {lat: 13.758460852025411, lng: 100.56608550098764},
      //   {lat: 13.759555053746698, lng: 100.5656831696354},
      //   {lat: 13.760388727814117, lng: 100.5644225313984},
      //   {lat: 13.76084724728501, lng: 100.56513331678735},
      //   {lat: 13.758664061303417, lng: 100.56396923807489},
      //   {lat: 13.757262434745641, lng: 100.56448958662378},
      //   {lat: 13.755664939006037, lng: 100.56179095704914},
      //   {lat: 13.760958806889262, lng: 100.55880834062458},
      //   {lat: 13.754935459634343, lng: 100.5658893724239},
      //   {lat: 13.764918708489473, lng: 100.57285238702656},
      //   {lat: 13.77048329900786, lng: 100.57023455102802},
      //   {lat: 13.765686838888675, lng: 100.56056772668661},
      //   {lat: 13.779151458041817, lng: 100.57631492614746},
      //   {lat: 13.778567933336179, lng: 100.56000709533691},
      //   {lat: 13.784943446175856, lng: 100.5644702911377},
      //   {lat: 13.767270775555032, lng: 100.55442810058594},
      //   {lat: 13.759100881941414, lng: 100.56060791015625},
      //   {lat: 13.753932026399186, lng: 100.5549430847168},
      //   {lat: 13.747012250793583, lng: 100.5607795715332},
      //   {lat: 13.693308111543569, lng: 100.71297506519821},
      //   {lat: 13.693000606648344, lng: 100.71257541605499},
      //   {lat: 13.693633857816044, lng: 100.71233133503463},
      //   {lat: 13.69299800067295, lng: 100.71239839026},
      //   {lat: 13.692375909189153, lng: 100.7124190642761},
      //   {lat: 13.692162218542274, lng: 100.71157685064543},
      //   {lat: 13.691382265188867, lng: 100.71146615390782},
      //   {lat: 13.690746401957991, lng: 100.71125157718663},
      //   {lat: 13.690298169467162, lng: 100.71300574188237},
      //   {lat: 13.690689069942856, lng: 100.710597118187},
      //   {lat: 13.69219285809273, lng: 100.7091269976823},
      //   {lat: 13.691061858168293, lng: 100.70824723312542},
      //   {lat: 13.690123665775388, lng: 100.71005288519596},
      //   {lat: 13.6867792050025, lng: 100.71297777213904},
      //   {lat: 13.692783454488579, lng: 100.71565998115393},
      //   {lat: 13.696744507379602, lng: 100.70819271125647},
      //   {lat: 13.70120582387771, lng: 100.71078908958289},
      //   {lat: 13.70395762173293, lng: 100.71819198646399},
      //   {lat: 13.699954996018812, lng: 100.72195025365929},
      //   {lat: 13.695639588810423, lng: 100.72184296529869}]
      //   getDocs(query(collection(this.db, 'users'), where('role', '==', 'ผู้ประกอบการ'))).then((payload)=>{
      //   let operatorIDs = payload.docs.map((userData)=>{
      //     return { _geoloc: userData.data()['_geoloc'], uid: userData.id}
      //   })
      //   let index = 0
      //   operatorIDs.forEach((id)=>{
      //     getDocs(query(collection(this.db, 'job-post'), where('OperatorUID', '==', id.uid))).then((job)=>{
      //       job.docs.forEach((jobData)=>{
      //         let job: any = _.cloneDeep(jobData.data()) as jobPostModel
              
      //         job._geoloc = id._geoloc
      //         updateDoc(doc(this.db, 'job-post', jobData.id), job).then((user)=>{
      //           console.log('change successful ' + jobData.id)
      //         })
      //       })
        
      //     })
      //   })
      // })
      if(user){
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

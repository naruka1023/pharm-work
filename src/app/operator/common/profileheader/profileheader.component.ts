import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Storage, getDownloadURL, getMetadata, getStorage, listAll, ref, uploadBytes, uploadString } from '@angular/fire/storage';
import { Observable, Subject, of } from 'rxjs';
import { coverPhotoLoadSuccessful, setCurrentUser, updateCoverPhoto, updateCoverPhotoOffset, updateCropProfilePicture, updateProfilePicture } from 'src/app/state/actions/users.action';
import { profileHeaderOperator } from '../../model/header.model';
import { jobPostModel } from '../../model/jobPost.model';
import { AppState, Favorite, User, UserPharma, requestView } from '../../model/user.model';
import { UtilService } from '../../service/util.service';
import { addFavorites, removeFavorite, toggleLoading } from '../../state/actions/users-actions';
import { UsersService } from '../../service/users.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import _ from 'lodash';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { FirebaseApp } from '@angular/fire/app';

declare var window: any;

@Component({
  selector: 'app-profileheader',
  templateUrl: './profileheader.component.html',
  styleUrls: ['./profileheader.component.css']
})
export class ProfileHeaderComponent {
private storage: Storage = inject(Storage)
private firebaseApp: FirebaseApp = inject(FirebaseApp)
@Input() profileType! : string;
@Input() viewFlag: boolean = false;
coverListenerSubject: Subject<string> = new Subject();
coverListenerObservable: Observable<string> = this.coverListenerSubject.asObservable();
result!: any 
file!: File
profileInformation$!: any
introTextLoadingFlag: boolean = false
requestViewFlag$: Observable<boolean> = of(true)
headerInformation!: Observable<profileHeaderOperator>
jobCount!: {
  normalJobs: number,
  urgentJobs: number
}
coverPhotoFlag$!: Observable<any>;
coverPhotoVerticalPosition!: number
editFlag: boolean = false
favoriteFlag$:Observable<boolean> = of(true);
favoriteLoadingFlag!: boolean;
localFlag: boolean = true;
followers$!: Observable<number>
favoriteID!: string;
sendUrgentJobsFlag!: boolean;
urgentJobObject: any = {};
categorySymbol!: string;
savePhotoLoadingFlag: boolean = false;
editCoverPhotoFlag: boolean = true;
userUID!: string;
formModal: any;
dynamicScale: number = 0.5;
introTextForm!: FormGroup
profilePictureFile!: File | null;
pictureType: string = "";
fixedScale: number = 0.5;
loadProfilePictureFlag: boolean = true;
photoFlag!: string;
requestStatus!: requestView;
portalLoadingFlag: boolean = false
pathToUploadPicture: boolean = false;
editExistingPhoto: boolean = true;
cropper: any = '';
realWidth: number = 0;
functions = getFunctions(this.firebaseApp, 'us-central1');
createPortalLink = httpsCallable(
  this.functions, 
  'ext-firestore-stripe-payments-createPortalLink');

constructor(private fb: FormBuilder, private userService:UsersService, private route:ActivatedRoute, private router: Router, private store: Store, private profileService: UtilService){}

  ngOnInit(){
    // firebaseApp is object created using initializeApp()
    // may need to change server location
  
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );
    this.categorySymbol = this.route.snapshot.queryParamMap.get('categorySymbol')!
    document.getElementById('myModal')?.addEventListener('hidden.bs.modal', ()=>{
      this.dynamicScale = 0.5
      this.profilePictureFile = null;
      this.pictureType = '';
      this.fixedScale = 0.5
      this.loadProfilePictureFlag = true
    })
    this.store.select((state: any)=>{
      return state.user.uid
    }).subscribe((value)=>{
      if(value !== ''){
        this.userUID = value
      }
    })
    this.coverPhotoFlag$ = this.store.select((state:any)=>{
      return state.user.coverPhotoFlag
    })
    this.coverPhotoFlag$.subscribe((flag:boolean)=>{
      this.photoFlag = flag?"hidden":"unset"
    })
    switch(this.profileType){
      case "pharma-profile":
        this.headerInformation = this.store.select((state: any)=>{
          switch(this.route.snapshot.queryParamMap.get('pageType')!){
            case 'recently-seen':
              this.profileInformation$ = state.recentlySeen.find((user: UserPharma)=>{
                return user.uid == this.route.snapshot.queryParamMap.get('userUID')
              })
              break;
            case 'notification':
              let newState = state.notifications.user.content
              this.profileInformation$ = newState
              break;
            case 'request-jobs':
              let profileLinkFlag = this.route.snapshot.queryParamMap.get('profileLinkPage')
              if(profileLinkFlag == 'true'){
                this.profileInformation$ = state.requestView[this.route.snapshot.queryParamMap.get('userUID') + '-' + state.user.uid]
                this.profileInformation$ = this.profileInformation$.content
              }else{
                let jobUID = this.route.snapshot.queryParamMap.get('jobUID')
                let requestUID = this.route.snapshot.queryParamMap.get('requestUID')
                this.profileInformation$ = state.requestedJobs.JobRequests[jobUID!].users[requestUID + '-' + this.route.snapshot.queryParamMap.get('userUID')]
              }
              break
            case 'favorites':
              this.profileInformation$ = state.users.Favorites[state.user.uid + '-' + this.route.snapshot.queryParamMap.get('userUID')]
              this.profileInformation$ = this.profileInformation$.content;
              break;
            default:
              this.profileInformation$ = state.users.users[this.route.snapshot.queryParamMap.get('categorySymbol')!][this.route.snapshot.queryParamMap.get('pageType')!][this.route.snapshot.queryParamMap.get('userUID')!];
              break;
          }
          return this.profileInformation$
        })
        this.headerInformation.subscribe((header)=>{
          this.result = _.cloneDeep(header);
          if(this.result.cropProfilePictureUrl == ''){
            delete this.result.cropProfilePictureUrl
          }
          this.sendUrgentJobsFlag = false;
          if(this.result.preferredJobType !== undefined){
            this.result.preferredJobType.forEach((jobType: string)=>{
              if(jobType == 'งานด่วนรายวัน'){
                this.sendUrgentJobsFlag = true
              }
            })
          }
          this.coverPhotoVerticalPosition = header.coverPhotoOffset!
        })
        break;
      case "job-post":
        this.store.select((state: any)=>{
          const allCreatedJobs: any = state.createdJobs.JobPost;
    
          let newJob:jobPostModel = allCreatedJobs.find((profile: any) =>{
              return profile.custom_doc_id == this.route.snapshot.queryParamMap.get('id')
          })
          return newJob
        }).subscribe((res: jobPostModel)=>{
          if(res !== undefined){
            this.result = {
              Establishment: res.Establishment,
              JobType: res.JobType,
              profilePictureUrl: res.profilePictureUrl!,
              cropProfilePictureUrl: res.cropProfilePictureUrl!,
              coverPhotoPictureUrl: res.coverPhotoPictureUrl,
              coverPhotoOffset: res.coverPhotoOffset!,
            }
            if(this.result.cropProfilePictureUrl == ''){
              delete this.result.cropProfilePictureUrl
            }
          }
        })
        break;
      case "operator-profile":
        this.headerInformation = this.store.select((state: any)=>{
          return state.user;
        })
        this.headerInformation.subscribe((header)=>{
          this.result = _.cloneDeep(header);
          if(this.result.cropProfilePictureUrl == ''){
            delete this.result.cropProfilePictureUrl
          }
            this.resetFormGroup();
          this.coverPhotoVerticalPosition = header.coverPhotoOffset!
        })
        this.followers$ = this.store.select((state: any)=>{
          return state.user.followers
        })
        this.store.select((state: any)=>{
          let allJobs = state.createdJobs.JobPost
          let normalJobs:number = 0
          let urgentJobs : number = 0
          allJobs.forEach((job: any)=>{
            if(job.Urgency){
              urgentJobs++
            }else{
              normalJobs++
            }
          })
          return {
            urgentJobs: urgentJobs,
            normalJobs: normalJobs
          }
        }).subscribe((jobCount: any)=>{
          this.jobCount = jobCount
        })
    }
    this.requestViewFlag$ = this.store.select((state: any) =>{
      let flag = true;
      
      if(this.userUID !== ''){
        let requestView: requestView = state.requestView[this.result.uid + '-' + this.userUID]
        if(requestView === undefined){
          flag = false;
        }else{
          this.requestStatus = requestView
        }
      }
      return flag 
    })
    this.favoriteFlag$ = this.store.select((state: any) =>{
      let flag = true;
      if(this.userUID !== ''){
        let newState: AppState = state.users
        let favorite: Favorite = newState.Favorites[this.userUID + '-' + this.result.uid]
        if(favorite === undefined){
          flag = false;
        }else{
          this.favoriteID = favorite.favoriteUID!
        }
        this.localFlag = flag;
      }
      return flag 
    })
    this.favoriteFlag$.subscribe((flag)=>{
    })
  }

  goToPortal(){
    // request Stripe to create a portal link, and redirect user there
    this.portalLoadingFlag = true
    this.createPortalLink({
      returnUrl: window.location.origin // can set this to a custom page,
    }).then((result: any) => {
      this.portalLoadingFlag = false
      window.location.assign(result.data.url);
    }).catch((error) => {
        // handle error
    });
  }

  initializeFormGroup(){
    this.introTextForm = this.fb.group({
      introText:[''],
    });
  }

  resetFormGroup(){
    this.initializeFormGroup();
    this.introTextForm.patchValue({introText: this.result.introText})
  }

  getFavoritePayload(){
    return {operatorUID: this.userUID, user:this.result, favoriteUID:this.favoriteID}
  }

  openRequestViewModal(){
    this.profileService.sendRequestViewSubject(this.result)
  }

  cancelIntroText(){
    this.editFlag = false;
    this.resetFormGroup()
  }

  toggleFavorite(){
    if(this.localFlag === true){
      this.favoriteLoadingFlag = true
      this.userService.removeFavorite(this.favoriteID).then((value: any)=>{
        this.store.dispatch(removeFavorite({operatorUID: this.userUID, userUID:this.result.uid}));
        this.favoriteLoadingFlag = false
      })
    }else{
      this.favoriteLoadingFlag = true
      this.userService.addFavorite(this.userUID,this.result.uid).then((value)=> {
        this.favoriteID = value.id
        this.store.dispatch(addFavorites(this.getFavoritePayload()))
        this.favoriteLoadingFlag = false
        this.localFlag = false;
      })
    }
  }

  onSave(){
    let payload = {
      ...this.introTextForm.value,
      uid: this.result.uid,
    }
    this.introTextLoadingFlag = true
    this.profileService.updateUser(payload).then(()=>{
      this.introTextLoadingFlag = false
      this.store.dispatch(setCurrentUser({user: payload}))
      this.editIntroTextClicked()
    })
  }

  goToBanner(){
    this.profileService.sendBuyBannerSubject()
  }

  editIntroTextClicked(){
    this.editFlag = !this.editFlag
    if(this.editFlag == false){
      this.resetFormGroup();
    }
  }

  ngAfterViewInit(){
    let ele = document.getElementById('coverPhoto')!
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    const mouseDownHandler = function (e: any) {
      if(e.clientX == undefined){
        pos = {
            // The current scroll
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY,
        };
      }else{
        pos = {
            // The current scroll
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };
      }
        ele.style.cursor = 'grabbing';
        document.addEventListener('touchmove', mouseMoveHandler);
        document.addEventListener('touchend', mouseUpHandler);        
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };
    const mouseMoveHandler = function (e: any) {
        // How far the mouse has been moved
        let dx = 0
        let dy = 0
        if(e.clientX == undefined){
          dx = e.changedTouches[0].clientX - pos.x;
          dy = e.changedTouches[0].clientY - pos.y;
        }else{
          dx = e.clientX - pos.x;
          dy = e.clientY - pos.y;
        }
        // Scroll the element
        ele.scrollTop = pos.top - dy;
        ele.scrollLeft = pos.left - dx;
    };
    const mouseUpHandler = function () {
        document.removeEventListener('touchmove', mouseMoveHandler);
        document.removeEventListener('touchend', mouseUpHandler);
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    
        ele.style.cursor = 'grab';
        ele.style.removeProperty('user-select');
    };
    this.coverListenerObservable.subscribe((cmd:string)=>{
      switch(cmd){
        case "enter":
            ele.addEventListener('touchstart', mouseDownHandler);
            ele.addEventListener('mousedown', mouseDownHandler);
          break;
          case "exit":
            ele.scrollTop = this.coverPhotoVerticalPosition
            let stg: any = document.getElementById('innerPhoto');
            stg.src = this.result.coverPhotoPictureUrl
            ele.removeEventListener('touchstart', mouseDownHandler);
            ele.removeEventListener('mousedown', mouseDownHandler);
            break;
            case "upload":
              this.savePhotoLoadingFlag = true;
              ele.removeEventListener('touchstart', mouseDownHandler);
              ele.removeEventListener('mousedown', mouseDownHandler);
              uploadBytes(ref(this.storage, 'users/' + this.userUID + '/cover-photo'), this.file).then(()=>{
                let user:Partial<User> = {uid:this.userUID, coverPhotoOffset: ele.scrollTop}
                if(this.result.coverPhotoPictureUrl.indexOf('placeholder') !== -1){

                  getDownloadURL(ref(this.storage, 'users/' + this.userUID + '/cover-photo')).then((url: string)=>{
                    user.coverPhotoPictureUrl = url
                    this.profileService.updateUser(user).then(()=>{
                      this.savePhotoLoadingFlag = false
                      this.store.dispatch(updateCoverPhoto({coverPhotoPictureUrl:url, offset: ele.scrollTop}));
                      this.editCoverPhotoFlag = true;
                    })
                    this.profileService.getUID(this.result.uid).then((docs)=>{
                      this.profileService.updateUserJobsCoverPhoto(docs, url, ele.scrollTop).then(()=>{
                      })
                    })
                  })
                }else{
                  user.coverPhotoPictureUrl = this.result.coverPhotoPictureUrl.split('?t=')[0] + '?t='  + new Date().getTime();
                  this.profileService.getUID(this.result.uid).then((docs: QuerySnapshot<DocumentData>)=>{
                    this.profileService.updateUserJobsCoverPhoto(docs, this.result.coverPhotoPictureUrl.split('?t=')[0] + '?t='  + new Date().getTime(), ele.scrollTop).then(()=>{
                    })
                  })
                  this.profileService.updateUser(user).then(()=>{
                    this.savePhotoLoadingFlag = false
                    this.store.dispatch(updateCoverPhoto({coverPhotoPictureUrl:user.coverPhotoPictureUrl!, offset: ele.scrollTop}));
                    this.editCoverPhotoFlag = true;
                  })
                }
              })
              break;
              case "save":
              this.savePhotoLoadingFlag = true;
              ele.removeEventListener('touchstart', mouseDownHandler);
              ele.removeEventListener('mousedown', mouseDownHandler);
              let user:Partial<User> = {uid:this.userUID, coverPhotoOffset: ele.scrollTop}
              user.coverPhotoPictureUrl = this.result.coverPhotoPictureUrl.split('?t=')[0] + '?t='  + new Date().getTime();
              this.profileService.getUID(this.result.uid).then((docs)=>{
                this.profileService.updateUserJobsCoverPhoto(docs, this.result.coverPhotoPictureUrl.split('?t=')[0] + '?t='  + new Date().getTime(), ele.scrollTop).then(()=>{
                })
              })
              this.profileService.updateUser(user).then(()=>{
                this.savePhotoLoadingFlag = false
                this.store.dispatch(updateCoverPhotoOffset({offset: ele.scrollTop}));
                this.editCoverPhotoFlag = true;
              })
            break;
      }
    })
    switch(this.profileType){
      case "job-post": 
        document.getElementById('innerPhoto')?.addEventListener('load', ()=>{
          const ele = document.getElementById('coverPhoto')!;
          ele.scrollTop = this.result.coverPhotoOffset;
        })!;
        break;
      case "pharma-profile": 
        document.getElementById('innerPhoto')?.addEventListener('load', ()=>{
          const ele = document.getElementById('coverPhoto')!;
          ele.scrollTop = this.result.coverPhotoOffset;
        })!;
        break;
      case "operator-profile":
        if(this.photoFlag !== "unset"){
          document.getElementById('innerPhoto')?.addEventListener('load', ()=>{
            const ele = document.getElementById('coverPhoto')!;
            ele.scrollTop =  this.coverPhotoVerticalPosition
            this.store.dispatch(coverPhotoLoadSuccessful());
          })!;
        }else{
          document.getElementById('coverPhoto')!.scrollTop = this.coverPhotoVerticalPosition;
        }
        break;
    }
  }

  editCoverPhotoClick(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
    this.editCoverPhotoFlag = false;
    this.pathToUploadPicture = false;
    this.coverListenerSubject.next('enter')
  }

  uploadProfilePicture(){
    let croppedNotExists: boolean = true;
    this.loadProfilePictureFlag = true;
    const storage = getStorage();
    if(!this.editExistingPhoto){
      uploadBytes(ref(this.storage, 'users/' + this.userUID + '/profile-picture'), this.profilePictureFile!).then(()=>{
        if(this.result.profilePictureUrl.indexOf('placeholder') !== -1){

          getDownloadURL(ref(this.storage,'users/' + this.userUID + '/profile-picture')).then((url: string)=>{
            let user:Partial<User> = {uid:this.userUID, profilePictureUrl: url}
            this.profileService.updateUser(user).then(()=>{
              this.store.dispatch(updateProfilePicture({profilePictureUrl: url}))
            })
          })
        }
      })
    }
    const storageRef = ref(storage, 'users/' + this.userUID + '/crop-profile');
    listAll(ref(storage, 'users/' + this.userUID)).then((list:any)=>{
      croppedNotExists = list.items.find((item: any)=>item.name === 'crop-profile') == undefined
      let imgSrc = this.cropper.getCroppedCanvas({
        width: 300,
        height: 300// input value
      }).toDataURL(this.pictureType);

      uploadString(storageRef, imgSrc, 'data_url').then(()=>{

        if(croppedNotExists){
          getDownloadURL(ref(this.storage, 'users/' + this.userUID + '/crop-profile')).then((url: string)=>{
            let user:Partial<User> = {uid:this.userUID, cropProfilePictureUrl: url}
            this.profileService.updateUser(user).then(()=>{
              this.loadProfilePictureFlag = false
              this.store.dispatch(updateCropProfilePicture({cropProfilePictureUrl: url}))
              this.formModal.hide()
            })
            this.profileService.getUID(this.result.uid).then((docs)=>{
              this.profileService.updateUserJobs(docs, url + '?t='  + new Date().getTime()).then(()=>{
              })
            })
          })
        }else{
          let profPic: any = document.getElementById('profilePicture')
          profPic.src = this.result.cropProfilePictureUrl + '?t='  + new Date().getTime();
          this.store.dispatch(updateCropProfilePicture({cropProfilePictureUrl: profPic.src}))
          this.loadProfilePictureFlag = false
          this.formModal.hide()
          this.profileService.getUID(this.result.uid).then((docs)=>{
            this.profileService.updateUserJobs(docs, this.result.cropProfilePictureUrl + '?t='  + new Date().getTime()).then(()=>{
            })
          })
        }
        
      })
    })
  }
  
  uploadProfilePictureClick(){
    document.getElementById('profilePictureFile')?.click();
  }
  
  uploadNewPhotoClick(){
    document.getElementById('fileUpload')?.click();
  }
  
  editProfilePictureClick($event:any, editExistingPhoto?: string){
    const reader = new FileReader();
    const self = this
    reader.onload = function(event) {
      if(event.target?.result){
        self.initCropper(event.target.result)
      }
    };
    this.editExistingPhoto = editExistingPhoto !== ''? true:false
    if(editExistingPhoto === ''){
      this.profilePictureFile = $event.target.files[0]
      this.pictureType = $event.target.files[0].type
      reader.readAsDataURL($event.target.files[0]);
    }else{
      getMetadata(ref(getStorage(), `users/${this.result.uid}/profile-picture`)).then((metaData:any)=>{
        this.pictureType = metaData.contentType
        self.initCropper(self.result.profilePictureUrl)
      })
    }
  }
  
  initCropper(picture:any){
    const self = this
    let img: any = document.createElement('img');
    img.src = picture;
    img.id = 'newProfilePicture'
    let imgContainer: any = document.querySelector("#imgContainer")!;
    imgContainer.innerHTML = '';
    imgContainer.appendChild(img)
    let myImg: any = document.getElementById('newProfilePicture')!;
    myImg.addEventListener("load", ()=>{
      let height = (50* window.innerHeight)/(100)
      self.realWidth = height * (myImg.naturalWidth/myImg.naturalHeight);
      self.cropper = new Cropper(myImg, {
        viewMode: 1,
        dragMode: 'move',
        aspectRatio: 1,
        autoCropArea: 0.68,
        minContainerHeight:height,
        minContainerWidth: self.realWidth,
        center: false,
        zoomOnWheel: true,
        zoomOnTouch: true,
        cropBoxMovable: true,
        scalable: true,
        cropBoxResizable: false,
        guides: false,
        ready: function(event) {
          let item: any = document.getElementsByClassName('cropper-view-box').item(0)
          let item2: any = document.getElementsByClassName('cropper-face').item(0)
          item.style.borderRadius = '100%'
          item2.style.borderRadius = '100%'
          self.loadProfilePictureFlag = false;
        },
      });
      self.formModal.show()
    })
    
  }
  
  repositionGuard(event:any){
    let something: any = document.getElementById('innerPhoto');
    something.src = (window.URL ? URL : webkitURL).createObjectURL(event.target.files[0]);
    this.editCoverPhotoClick();
    this.pathToUploadPicture = true;
    this.file = event.target.files[0]
  }

  valueChanges($event:any){
    let doc: any = document.getElementById("customRange2")! 
    let zoomRatio = ((doc.value - this.fixedScale)*10)/10; 
    this.fixedScale = doc.value;
    this.cropper.zoom(zoomRatio);	    
  }

  saveCoverPhotoClick(){
    this.coverListenerSubject.next('save');
  }
  
  uploadCoverPhotoClick(){
    this.coverListenerSubject.next('upload');
  }

  cancelCoverPhotoClick(){
    this.editCoverPhotoFlag = true;
    this.coverListenerSubject.next('exit');
  }
  

  openPageView(){
    this.profileService.sendCallView();
  }
}

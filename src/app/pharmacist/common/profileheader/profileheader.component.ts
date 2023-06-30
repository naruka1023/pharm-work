import { AfterViewInit, Component, Input, inject } from '@angular/core';
import { getDownloadURL, getMetadata, Storage, listAll, ref, uploadBytes, uploadString } from "@angular/fire/storage";
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import Cropper from 'cropperjs';
import { Observable, Subject } from 'rxjs';
import { coverPhotoLoadSuccessful, setCurrentUser, updateCoverPhoto, updateCropProfilePicture, updateProfilePicture } from 'src/app/state/actions/users.action';
import { profileHeaderJobPost, profileHeaderOperator, profileHeaderPharma } from '../../model/typescriptModel/header.model';
import { AppState, Follow, filterConditions, jobPostModel, userOperator } from '../../model/typescriptModel/jobPost.model';
import { User } from '../../model/typescriptModel/users.model';
import { JobPostService } from '../../service/job-post.service';
import { UserServiceService } from '../../service/user-service.service';
import { addFollowers, removeFollowers } from '../../state/actions/job-post.actions';
import { FormBuilder, FormGroup } from '@angular/forms';
import { emptyOperatorData } from '../../state/actions/operator.actions';
declare var window: any;
 
@Component({
  selector: 'app-profileheader',
  templateUrl: './profileheader.component.html',
  styleUrls: ['./profileheader.component.css']
})
export class ProfileheaderComponent implements AfterViewInit{
private storage: Storage = inject(Storage);
@Input() profileInformation!: profileHeaderJobPost | profileHeaderPharma | profileHeaderOperator
@Input() profileType! : string;
@Input() followerFlag = false;
@Input() requestViewFlag = false;
followingFlag: boolean = true
result!: any
jobCount!: {
  urgentJobs: number,
  normalJobs: number
}
operatorExistFlag!: boolean 
editFlag: boolean = false
profileInformation$!: User
followers$!: Observable<number>
coverPhotoFlag$!: Observable<boolean>;
headerInformation!: Observable<profileHeaderPharma>
coverListenerSubject: Subject<string> = new Subject();
followFlag$!:any
introTextLoadingFlag: boolean = false
coverListenerObservable: Observable<string> = this.coverListenerSubject.asObservable();
file!: File
id!: string
coverPhotoVerticalPosition!: number;
followedText: string = 'ติดตามแล้ว'
profilePictureFile!: any
formModal: any
introTextForm!: FormGroup
operator!:userOperator;
followerUID!: string
categorySymbol!: string
photoFlag!:string;
operatorUID!: string
userUID!: string
pictureType: string = ""
cropper: any = '';
editCoverPhotoFlag: boolean = true
savePhotoLoadingFlag: boolean = false;
editExistingPhoto: boolean = true;
loadProfilePictureFlag: boolean = true;
pathToUploadPicture: boolean = false;
followLoading: boolean = false;
localFlag: boolean = true
profileMaskSize: number = 20;
realWidth: number = 0;
fixedScale: number = 0.5;
dynamicScale: number = 0.5;
pageSrc!: string
constructor(private fb: FormBuilder, private store: Store, private userService: UserServiceService, private jobPostService: JobPostService, private router: Router, private route: ActivatedRoute){}

  ngOnInit(){
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );
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
      case "job-post":
        this.id = this.route.snapshot.queryParamMap.get('id')!;
        this.categorySymbol = this.route.snapshot.queryParamMap.get('categorySymbol')!;
        this.pageSrc = this.route.snapshot.queryParamMap.get('pageSrc')!;
        this.store.select((state: any)=>{
            let newJob!: jobPostModel
            switch(this.pageSrc){
              case 'homePage':
                const categories: jobPostModel[] = state.jobpost.JobPost;
                const jobPost: any = categories.find((job)=>{
                  return job.CategorySymbol == this.categorySymbol
                })
                newJob = jobPost?.content?.find((profile: any) =>{
                    return profile.custom_doc_id == this.id
                })
                break;
                case 'jobs-list':
                  const categories2: filterConditions[] = state.jobpost.JobPost;
                  const jobPost2: any = categories2.find((job)=>{
                    return job.CategorySymbol == this.categorySymbol
                  })          
                  newJob = jobPost2?.allContent?.find((profile: any) =>{
                      return profile.custom_doc_id == this.id
                  })
                  break;
                case 'recently-seen-job':
                  newJob = state?.recentlySeen?.find((profile: any) =>{
                      return profile.custom_doc_id == this.id
                  })
                  break;
                case 'request-jobs':
                  newJob = state.jobpost.JobRequests[this.id + '-' + state.user.uid].JobPost
                  break;
                case 'bookmark':
                  newJob = state.jobpost.Bookmarks[this.id + '-' + state.user.uid].JobPost
                  break;
                case 'operator-page':
                  if(this.route.snapshot.queryParamMap.get('operatorExistFlag') !== null){
                    let flag = this.route.snapshot.queryParamMap.get('operatorExistFlag') == 'true'? true: false
                    if(flag){ 
                      let categorySymbol = this.route.snapshot.queryParamMap.get('jobType')! == 'ร้านยาแบรนด์'? 'BA' : 'CB'
                      let operatorUID = this.route.snapshot.queryParamMap.get('operatorUID')
                      let filter : filterConditions = state.jobpost.JobPost.find((filter:filterConditions)=>{
                        return filter.CategorySymbol === categorySymbol
                      })
                      newJob = filter.content.find((userOperator:userOperator)=>{
                        return userOperator.uid == operatorUID
                      }).operatorJobs[this.id]  
                    }else{
                      newJob = state.operator.operatorJobs[this.id]
                    }
                  }else{
                    newJob = state.operator.operatorJobs[this.id]
                  }
                  break;
            }
            return newJob
          }).subscribe((newJob: jobPostModel)=>{
            if(Object.keys(newJob).length <= 20){
              this.result = {
                Amount: 2,
                CategorySymbol: '',
                BTS: {
                  Near: false,
                  Station: ''
                },
                Establishment: '',
                Franchise: '',
                JobName: '',
                JobType: '',
                Location: {
                  Section: '',
                  District: '',
                  Province: ''
                },
                MRT: {
                  Near: false,
                  Station: ''
                },
                SRT: {
                  Near: false,
                  Station: ''
                },
                ARL: {
                  Near: false,
                  Station: ''
                },
                OnlineInterview: false,
                WorkFromHome: false,
                Salary: {
                  Amount: '',
                  Cap: undefined,
                  Suffix: ''
                },
                Contacts: {
                  phone: '',
                  email: '',
                  line: '',
                  facebook: ''
                },
                JobDetails: '',
                TravelInstructions: '',
                qualityApplicants: '',
                jobBenefits: '',
                applyInstructions: '',
                OperatorUID: '',
                TimeFrame: '',
                Urgency: false,
                Duration: '',
                Active: false,
                DateOfJob: [],
                dateCreated: '',
                dateUpdated: '',
                dateUpdatedUnix: 0,
                custom_doc_id: ''
              }
            }else{
              this.operatorUID = newJob.OperatorUID; 
              this.result = newJob
              if(this.result.cropProfilePictureUrl == ''){
                delete this.result.cropProfilePictureUrl
              }
            }
          })
        break;
        case "operator-profile":
          this.operatorUID = this.route.snapshot.queryParamMap.get('operatorUID')!;
          this.operatorExistFlag = this.route.snapshot.queryParamMap.get('operatorExistFlag') == 'true'?true:false

          this.store.select((state:any)=> {
            if(this.followerFlag){
              return state.jobpost.Follows[this.userUID + '-' + this.operatorUID].user
            }
            if(this.requestViewFlag){
                return state.requestView[this.userUID + '-' + this.operatorUID].content
             }
            if(this.operatorExistFlag){
              let categorySymbol = this.route.snapshot.queryParamMap.get('jobType') == 'ร้านยาแบรนด์'? 'BA' : 'CB'
              return state.jobpost.JobPost.find((filterCondition: filterConditions)=>{
                return filterCondition.CategorySymbol == categorySymbol
              }).content.find((user:userOperator)=>{
                return user.uid == this.operatorUID
              })
            }
              return state.operator
          }).subscribe((operator)=>{
          this.operator =  operator;
          this.operatorUID = operator.uid;
          this.result = operator
          if(this.result.cropProfilePictureUrl == ''){
            delete this.result.cropProfilePictureUrl
          }
        })
        this.followers$ = this.store.select((state: any)=>{
          if(this.operatorExistFlag){
            let categorySymbol = this.route.snapshot.queryParamMap.get('jobType') == 'ร้านยาแบรนด์'? 'BA' : 'CB'
            return state.jobpost.JobPost.find((filterCondition: filterConditions)=>{
              return filterCondition.CategorySymbol == categorySymbol
            }).content.find((user:userOperator)=>{
              return user.uid == this.operatorUID
            }).followers
          }else{
            return state.operator.followers
          }
        })
        this.store.select((state: any)=>{
          let allJobs: jobPostModel[] = []
          let normalJobs:number = 0
          let urgentJobs : number = 0
          let operatorJobs: any
          if(this.operatorExistFlag){
            let operatorUID = this.route.snapshot.queryParamMap.get('operatorUID')  
            let categorySymbol = this.route.snapshot.queryParamMap.get('jobType') == 'ร้านยาแบรนด์'? 'BA' : 'CB'
            operatorJobs = state.jobpost.JobPost.find((filterCondition: filterConditions)=>{
              return filterCondition.CategorySymbol == categorySymbol
            }).content.find(((operator:userOperator)=>{
              return operator.uid == operatorUID
            })).operatorJobs
          }else{
            operatorJobs = state.operator.operatorJobs
          }
          if(operatorJobs !== undefined){
            Object.keys(operatorJobs).forEach((key)=>{
              allJobs.push(operatorJobs[key])
            })
            allJobs.forEach((job: any)=>{
              if(job.Urgency){
                urgentJobs++
              }else{
                normalJobs++
              }
            })

          }
          return {
            urgentJobs: urgentJobs,
            normalJobs: normalJobs
          }
        }).subscribe((jobCount: any)=>{
          this.jobCount = jobCount
        })
        break;
      case "pharmacist-profile":
        this.headerInformation = this.store.select((state: any)=>{
          this.profileInformation$ = state.user;
          let result = {
            nickName: this.profileInformation$.nickName!,
            Location: this.profileInformation$.Location,
            profilePictureUrl: this.profileInformation$.profilePictureUrl,
            coverPhotoPictureUrl: this.profileInformation$.coverPhotoPictureUrl,
            cropProfilePictureUrl: this.profileInformation$.cropProfilePictureUrl,
            coverPhotoOffset: this.profileInformation$.coverPhotoOffset!,
            uid: this.profileInformation$.uid,
            introText: this.profileInformation$.introText,
            preferred:{
              timeFrame: this.profileInformation$.preferredTimeFrame,
              jobType: this.profileInformation$.preferredJobType,
              province: this.profileInformation$.preferredProvince,
              district: this.profileInformation$.preferredDistrict,
              salary: this.profileInformation$.preferredSalary,
            }
          }
          if(result.cropProfilePictureUrl == ''){
            delete result.cropProfilePictureUrl
          }
          return result
        })
        this.headerInformation.subscribe((header)=>{
          this.result = header;
          if(this.profileType == 'pharmacist-profile'){
            this.resetFormGroup();
          }
          this.coverPhotoVerticalPosition = header.coverPhotoOffset
        })
        break;
    }
    this.followFlag$ = this.store.select((state: any) => {
      let flag = true;
      if(this.userUID !== ''){
        let newState: AppState = state.jobpost
        let follow: Follow = newState.Follows[this.userUID + '-' + this.operatorUID]
        if(follow === undefined){
          flag = false;
        }else{
          this.followerUID = follow.followUID!
        }
        this.localFlag = flag;
      }
      return flag 
    })
    this.followFlag$.subscribe((follow: any)=>{
      this.followingFlag = follow
    })
  }

  ngAfterViewInit(){
    const mouseTarget = document.getElementById("mouseTarget")!
    ;
    if(mouseTarget !== null){
      mouseTarget.addEventListener("mouseenter", (e) => {
        if(this.followingFlag){
          this.followedText = 'ยกเลิกติดตาม'
        }
      });
  
      mouseTarget.addEventListener("mouseleave", (e) => {
        if(this.followingFlag){
          this.followedText = 'ติดตามแล้ว'
        }
      });
    }
    const mouseTarget2 = document.getElementById("mouseTarget2")!;
    
    if(mouseTarget2 !== null){
      mouseTarget2.addEventListener("mouseenter", (e) => {
        if(this.followingFlag){
          this.followedText = 'ยกเลิกติดตาม'
        }
      });
  
      mouseTarget2.addEventListener("mouseleave", (e) => {
        if(this.followingFlag){
          this.followedText = 'ติดตามแล้ว'
        }
      });
    }

    const mouseTarget3 = document.getElementById("mouseTarget3")!;
    if(mouseTarget3 !== null){

      mouseTarget3.addEventListener("mouseenter", (e) => {
        if(this.followingFlag){
          this.followedText = 'ยกเลิกติดตาม'
        }
      });
  
      mouseTarget3.addEventListener("mouseleave", (e) => {
        if(this.followingFlag){
          this.followedText = 'ติดตามแล้ว'
        }
      });
    }

    let ele = document.getElementById('coverPhoto')!
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    const mouseDownHandler = function (e: any) {
        pos = {
            // The current scroll
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };
        ele.style.cursor = 'grabbing';
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };
    const mouseMoveHandler = function (e: any) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;
    
        // Scroll the element
        ele.scrollTop = pos.top - dy;
        ele.scrollLeft = pos.left - dx;
    };
    const mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    
        ele.style.cursor = 'grab';
        ele.style.removeProperty('user-select');
    };
    this.coverListenerObservable.subscribe((cmd:string)=>{
      switch(cmd){
        case "enter":
            ele.addEventListener('mousedown', mouseDownHandler);
          break;
          case "exit":
            ele.scrollTop = this.coverPhotoVerticalPosition
            let stg: any = document.getElementById('innerPhoto');
            stg.src = this.result.coverPhotoPictureUrl
            ele.removeEventListener('mousedown', mouseDownHandler);
            break;
            case "upload":
              this.savePhotoLoadingFlag = true;
              ele.removeEventListener('mousedown', mouseDownHandler);
              uploadBytes(ref(this.storage, 'users/' + this.userUID + '/cover-photo'), this.file).then(()=>{
                if(this.result.coverPhotoPictureUrl.indexOf('placeholder') !== -1){
                  let user:Partial<User> = {uid:this.userUID, coverPhotoOffset: ele.scrollTop}
                  getDownloadURL(ref(this.storage, 'users/' + this.userUID + '/cover-photo')).then((url: string)=>{
                    user.coverPhotoPictureUrl = url
                    this.userService.updateUser(user).then(()=>{
                      this.savePhotoLoadingFlag = false
                      this.store.dispatch(updateCoverPhoto({coverPhotoPictureUrl:url, offset: ele.scrollTop}));
                      this.editCoverPhotoFlag = true;
                    })
                  })
                }else{
                  let userr:Partial<User> = {uid:this.userUID, coverPhotoPictureUrl: this.result.coverPhotoPictureUrl.split('?t=')[0] + '?t='  + new Date().getTime(), coverPhotoOffset: ele.scrollTop}

                  this.userService.updateUser(userr).then(()=>{
                    this.savePhotoLoadingFlag = false
                    this.store.dispatch(updateCoverPhoto({coverPhotoPictureUrl:userr.coverPhotoPictureUrl!,offset: ele.scrollTop}));
                    this.editCoverPhotoFlag = true;
                  })

                }
              })
              break;
            case "save":
              this.savePhotoLoadingFlag = true;
              ele.removeEventListener('mousedown', mouseDownHandler);
              let user:Partial<User> = {uid:this.userUID, coverPhotoOffset: ele.scrollTop, coverPhotoPictureUrl:this.result.coverPhotoPictureUrl.split('?t=')[0] + '?t='  + new Date().getTime()}
              this.userService.updateUser(user).then(()=>{
                this.savePhotoLoadingFlag = false
                this.store.dispatch(updateCoverPhoto({coverPhotoPictureUrl: user.coverPhotoPictureUrl!, offset: ele.scrollTop}));
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
    case "operator-profile": 
      document.getElementById('innerPhoto')?.addEventListener('load', ()=>{
        const ele = document.getElementById('coverPhoto')!;
        ele.scrollTop = this.result.coverPhotoOffset;
      })!;
      break;
      case "pharmacist-profile":
        if(this.photoFlag !== "unset"){
          document.getElementById('innerPhoto')?.addEventListener('load', ()=>{
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

    initializeFormGroup(){
      this.introTextForm = this.fb.group({
        introText:[''],
        nickName: ['']
      });
    }
    resetFormGroup(){
      this.initializeFormGroup();
      this.introTextForm.patchValue({introText: this.result.introText, nickName: this.result.nickName})
    }

    uploadProfilePicture(){
      let croppedNotExists: boolean = true;
      this.loadProfilePictureFlag = true;
      if(!this.editExistingPhoto){
        uploadBytes(ref(this.storage,'users/' + this.userUID + '/profile-picture'), this.profilePictureFile).then(()=>{
          if(this.result.profilePictureUrl.indexOf('placeholder') !== -1){
            getDownloadURL(ref(this.storage, 'users/' + this.userUID + '/profile-picture')).then((url: string)=>{
              let user:Partial<User> = {uid:this.userUID, profilePictureUrl: url}
              this.userService.updateUser(user).then(()=>{
                this.store.dispatch(updateProfilePicture({profilePictureUrl: url}))
              })
            })
          }
        })
      }
      const storageRef = ref(this.storage, 'users/' + this.userUID + '/crop-profile');
      listAll(ref(this.storage, 'users/' + this.userUID)).then((list:any)=>{
        croppedNotExists = list.items.find((item: any)=>item.name === 'crop-profile') == undefined
        let imgSrc = this.cropper.getCroppedCanvas({
          width: 300,
          height: 300// input value
        }).toDataURL(this.pictureType);
        uploadString(storageRef, imgSrc, 'data_url').then(()=>{
          if(croppedNotExists){
            getDownloadURL(storageRef).then((url: string)=>{
              let user:Partial<User> = {uid:this.userUID, cropProfilePictureUrl: url}
              this.userService.updateUser(user).then(()=>{
                this.loadProfilePictureFlag = false
                this.store.dispatch(updateCropProfilePicture({cropProfilePictureUrl: url}))
                this.formModal.hide()
              })
            })
          }else{
            let profPic: any = document.getElementById('profilePicture')
            profPic.src = this.result.cropProfilePictureUrl.split('?t=')[0] + '?t='  + new Date().getTime();
            let user:Partial<User> = {uid:this.userUID, cropProfilePictureUrl: profPic.src}
            this.userService.updateUser(user).then(()=>{
              this.store.dispatch(updateCropProfilePicture({cropProfilePictureUrl: profPic.src}))
              this.loadProfilePictureFlag = false
              this.formModal.hide()
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
        let reff: any = ref(this.storage, `users/${this.result.uid}/profile-picture`)
        getMetadata(reff).then((metaData)=>{
          this.pictureType = metaData.contentType!
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
      this.userService.sendCallView();
    }
    

  toggleFollow(){
    if(this.localFlag){
      this.unFollowOperator()
    }else{
      this.followOperator()
    }
  }
    
  followOperator(){
    if(localStorage.getItem('loginState') == 'false'){
      this.router.navigate(['pharma/login'])
    }else{
      this.followLoading = true
      let follower: Follow = {
        userUID: this.userUID,
        operatorUID: this.operatorUID,
      }
      this.jobPostService.followOperator(follower).then((response: any)=>{
        this.followedText = 'ติดตามแล้ว'
        this.followLoading = false
        follower = {
          ...follower,
          followUID:response.id,
          user:this.operator
        }
        this.store.dispatch(addFollowers({operator:follower}));
      });
    }
  }
  
  unFollowOperator(){
    this.followLoading = true
    this.jobPostService.unfollowOperator(this.followerUID).then(()=>{
      this.followLoading = false
      this.store.dispatch(removeFollowers({userUID:this.userUID, operatorUID: this.operatorUID}))
    });
  }

  goToOperatorProfile(){
    this.router.navigate(['/pharma/operator-page'], {
      queryParams: 
      {
        operatorUID: this.operatorUID,
        requestViewFlag: false,
        followFlag: false
      }
    })
  }
  onSave(){
    let payload = {
      ...this.introTextForm.value,
      uid: this.result.uid,
    }
    this.introTextLoadingFlag = true
    this.userService.updateUser(payload).then(()=>{
      this.introTextLoadingFlag = false
      this.store.dispatch(setCurrentUser({user: payload}))
      this.editIntroTextClicked()
    })
  }
  cancelIntroText(){
    this.editFlag = false;
    this.resetFormGroup()
  }
  editIntroTextClicked(){
    this.editFlag = !this.editFlag
    if(this.editFlag == false){
      this.resetFormGroup();
    }
  }
}

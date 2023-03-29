import { Component, Input } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { getMetadata, getStorage, listAll, ref, uploadString } from 'firebase/storage';
import { Observable, Subject } from 'rxjs';
import { coverPhotoLoadSuccessful, updateCoverPhoto, updateCoverPhotoOffset, updateCropProfilePicture, updateProfilePicture } from 'src/app/state/actions/users.action';
import { profileHeaderJobPost, profileHeaderOperator, profileHeaderPharma } from '../../model/header.model';
import { jobPostModel } from '../../model/jobPost.model';
import { User, UserPharma } from '../../model/user.model';
import { UtilService } from '../../service/util.service';
import { toggleLoading } from '../../state/actions/users-actions';
declare var window: any;

@Component({
  selector: 'app-profileheader',
  templateUrl: './profileheader.component.html',
  styleUrls: ['./profileheader.component.css']
})
export class ProfileHeaderComponent {
@Input() profileType! : string;
@Input() viewFlag: boolean = false;
coverListenerSubject: Subject<string> = new Subject();
coverListenerObservable: Observable<string> = this.coverListenerSubject.asObservable();
result!: any 
profileInformation$!: any
headerInformation!: Observable<profileHeaderOperator>
coverPhotoFlag$!: Observable<any>;
coverPhotoVerticalPosition!: number
  savePhotoLoadingFlag: boolean = false;
  editCoverPhotoFlag: boolean = true;
  userUID!: string;
  formModal: any;
  dynamicScale: number = 0.5;
  profilePictureFile!: null;
  pictureType: string = "";
  fixedScale: number = 0.5;
  loadProfilePictureFlag: boolean = true;
  photoFlag!: string;
  pathToUploadPicture: boolean = false;
  editExistingPhoto: boolean = true;
  cropper: any = '';
  realWidth: number = 0;

constructor(private storage:AngularFireStorage, private route:ActivatedRoute, private store: Store, private profileService: UtilService){}

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
      case "pharma-profile":
        this.headerInformation = this.store.select((state: any)=>{
          switch(this.route.snapshot.queryParamMap.get('pageType')!){
            case 'recently-seen':
              this.profileInformation$ = state.recentlySeen.find((user: UserPharma)=>{
                return user.uid == this.route.snapshot.queryParamMap.get('userUID')
              })
              break;
            case 'favorites':
              this.profileInformation$ = state.users.Favorites[state.user.uid + '-' + this.route.snapshot.queryParamMap.get('userUID')]
              this.profileInformation$ = this.profileInformation$.content;
              break;
            default:
              this.profileInformation$ = state.users.users[this.route.snapshot.queryParamMap.get('categorySymbol')!][this.route.snapshot.queryParamMap.get('pageType')!][this.route.snapshot.queryParamMap.get('userUID')!];
              break;
          }
          return{
            name: this.profileInformation$.companyName!,
            Location: this.profileInformation$.Location,
            JobType: this.profileInformation$.jobType!,
            profilePictureUrl: this.profileInformation$.profilePictureUrl!,
            cropProfilePictureUrl: this.profileInformation$.cropProfilePictureUrl!,
            coverPhotoPictureUrl: this.profileInformation$.coverPhotoPictureUrl,
            coverPhotoOffset: this.profileInformation$.coverPhotoOffset!,
            uid: this.profileInformation$.uid
          }
        })
        this.headerInformation.subscribe((header)=>{
          this.result = header;
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
          }
        })
        break;
      case "operator-profile":
        this.headerInformation = this.store.select((state: any)=>{
          this.profileInformation$ = state.user;
          return{
            name: this.profileInformation$.companyName!,
            Location: this.profileInformation$.Location,
            JobType: this.profileInformation$.jobType!,
            profilePictureUrl: this.profileInformation$.profilePictureUrl!,
            cropProfilePictureUrl: this.profileInformation$.cropProfilePictureUrl!,
            coverPhotoPictureUrl: this.profileInformation$.coverPhotoPictureUrl,
            coverPhotoOffset: this.profileInformation$.coverPhotoOffset!,
            uid: this.profileInformation$.uid
          }
        })
        this.headerInformation.subscribe((header)=>{
          this.result = header;
          this.coverPhotoVerticalPosition = header.coverPhotoOffset!
        })
    }
  }
  ngAfterViewInit(){
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
              this.storage.upload('users/' + this.userUID + '/cover-photo', this.file).then(()=>{

                let user:Partial<User> = {uid:this.userUID, coverPhotoOffset: ele.scrollTop}
                
                if(this.result.coverPhotoPictureUrl.indexOf('placeholder') !== -1){
                  this.storage.ref('users/' + this.userUID + '/cover-photo').getDownloadURL().subscribe((url: string)=>{
                    user.coverPhotoPictureUrl = url
                    this.profileService.updateUser(user).then(()=>{
                      this.savePhotoLoadingFlag = false
                      this.store.dispatch(updateCoverPhoto({coverPhotoPictureUrl:url, offset: ele.scrollTop}));
                      this.editCoverPhotoFlag = true;
                    })
                    this.profileService.getUID(this.result.uid).subscribe((docs: any)=>{
                      this.profileService.updateUserJobsCoverPhoto(docs, url, ele.scrollTop).then(()=>{
                        console.log('all jobs updated');
                      })
                    })
                  })
                }else{
                  user.coverPhotoPictureUrl = this.result.coverPhotoPictureUrl.split('?t=')[0] + '?t='  + new Date().getTime();
                  this.profileService.getUID(this.result.uid).subscribe((docs: any)=>{
                    this.profileService.updateUserJobsCoverPhoto(docs, this.result.coverPhotoPictureUrl.split('?t=')[0] + '?t='  + new Date().getTime(), ele.scrollTop).then(()=>{
                      console.log('all jobs updated');
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
              ele.removeEventListener('mousedown', mouseDownHandler);
              let user:Partial<User> = {uid:this.userUID, coverPhotoOffset: ele.scrollTop}
              user.coverPhotoPictureUrl = this.result.coverPhotoPictureUrl.split('?t=')[0] + '?t='  + new Date().getTime();
              this.profileService.getUID(this.result.uid).subscribe((docs: any)=>{
                this.profileService.updateUserJobsCoverPhoto(docs, this.result.coverPhotoPictureUrl.split('?t=')[0] + '?t='  + new Date().getTime(), ele.scrollTop).then(()=>{
                  console.log('all jobs updated');
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
      this.storage.upload('users/' + this.userUID + '/profile-picture', this.profilePictureFile).then(()=>{
        if(this.result.profilePictureUrl.indexOf('placeholder') !== -1){
          this.storage.ref('users/' + this.userUID + '/profile-picture').getDownloadURL().subscribe((url: string)=>{
            let user:Partial<User> = {uid:this.userUID, profilePictureUrl: url}
            this.profileService.updateUser(user).then(()=>{
              this.store.dispatch(updateProfilePicture({profilePictureUrl: url}))
            })
          })
        }
        console.log('profile picture upload');
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
        console.log('crop profile uploaded: ' + this.userUID);

        if(croppedNotExists){
          this.storage.ref('users/' + this.userUID + '/crop-profile').getDownloadURL().subscribe((url: string)=>{
            let user:Partial<User> = {uid:this.userUID, cropProfilePictureUrl: url}
            this.profileService.updateUser(user).then(()=>{
              this.loadProfilePictureFlag = false
              this.store.dispatch(updateCropProfilePicture({cropProfilePictureUrl: url}))
              console.log('crop profile updated');
              this.formModal.hide()
            })
            this.profileService.getUID(this.result.uid).subscribe((docs: any)=>{
              this.profileService.updateUserJobs(docs, url + '?t='  + new Date().getTime()).then(()=>{
                console.log('all jobs updated');
              })
            })
          })
        }else{
          let profPic: any = document.getElementById('profilePicture')
          profPic.src = this.result.cropProfilePictureUrl + '?t='  + new Date().getTime();
          this.store.dispatch(updateCropProfilePicture({cropProfilePictureUrl: profPic.src}))
          this.loadProfilePictureFlag = false
          this.formModal.hide()
          this.profileService.getUID(this.result.uid).subscribe((docs: any)=>{
            this.profileService.updateUserJobs(docs, this.result.cropProfilePictureUrl + '?t='  + new Date().getTime()).then(()=>{
              console.log('all jobs updated');
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
    console.log(zoomRatio)
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
  
  file(arg0: string, file: any) {
    throw new Error('Method not implemented.');
  }

  openPageView(){
    this.profileService.sendCallView();
  }
  editProfileClicked(){
    this.profileService.sendEditSubject();
  }
}

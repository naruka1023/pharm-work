import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { profileHeaderJobPost } from '../../model/typescriptModel/header.model';
import { AppState, Bookmark, filterConditions, jobPostModel, jobRequest, userOperator } from '../../model/typescriptModel/jobPost.model';
import { JobPostService } from '../../service/job-post.service';
import { UtilService } from '../../service/util.service';
import { removeBookmark, updateJobFromJobCategory, updateJobFromHome } from '../../state/actions/job-post.actions';
import { getUrgentJobsSuccess } from '../../state/actions/urgent-jobs.actions';
import { updateRecentlySeenJob } from '../../state/actions/recently-seen.actions';
import { LandingPageComponent } from '../../landing-page.component';
declare let window: any;

@Component({
  selector: 'app-job-post-details',
  templateUrl: './job-post-details.component.html',
  styleUrls: ['./job-post-details.component.css']
})
export class JobPostDetailsComponent implements OnDestroy{

  constructor(private landingPageComponent: LandingPageComponent, private jobPostService:JobPostService, private route: ActivatedRoute, private utilService:UtilService , private router: Router, private store: Store){}

  loading$!:Observable<boolean>;
  id!: string;
  formModal: any
  categorySymbol!: string;
  childrenPath!: string;
  studentFlag$!: Observable<boolean>;
  breakingPoint = {
    1400: {
      slidesPerView: 4.5
    },
    1200: {
      slidesPerView: 4
    },
    992: {
      slidesPerView: 3
    },
    768: {
      slidesPerView: 2.5
    },
    420: {
      slidesPerView: 1.5
    },
  }
  profile:jobPostModel = {
    Amount: '',
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
      Amount: 0,
      Cap: 0,
      Suffix: ''
    },
    Contacts: {
      nameRepresentative: '',
      areaOfContact: '',
      phone: '',
      email: '',
      line: '',
      website: '',
      facebook: '',
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
  };
  zoom: number = 15
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
  loadingConfirmRequestFlag: boolean = false
  loadingFlag: boolean = true;
  successFlag: boolean = false;
  profileHeader!: profileHeaderJobPost;
  bookmarkLoadingFlag: boolean = false;
  detailLeavingFlag: boolean = true;
  bookmarkFlag$:Observable<boolean> = of(true);
  userID!: string
  bookmarkID!: string; 
  requestFlag$!: Observable<boolean>
  localFlag: boolean = true;
  urgentJobs:jobPostModel[] = []
  subscription: Subscription = new Subscription;
  fullName!: string 
  profileImageUrl!: string


  ngOnInit(){
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('confirmRequest')
    );
    this.detailLeavingFlag = true;
    this.studentFlag$ = this.store.select((state:any)=>{
      return state.user.studentFlag  
    })
    this.store.select((state: any) =>{
      return state.user.cropProfilePictureUrl !== undefined && state.user.cropProfilePictureUrl !== ''? state.user.cropProfilePictureUrl : state.user.profilePictureUrl
    }).subscribe((res)=>{ 
      this.profileImageUrl = res
    })
    
    this.store.select((state: any)=>{
      return state.user.uid
    }).subscribe((value)=>{
      if(value !== ''){
        this.userID = value
      }
      this.id = this.route.snapshot.queryParamMap.get('id')!;
      this.categorySymbol = this.route.snapshot.queryParamMap.get('categorySymbol')!;
      this.childrenPath = this.route.snapshot.queryParamMap.get('pageSrc')!;
      this.loading$ = this.store.select((state: any) =>{
        return state.jobpost.loading;
      });
      this.loading$.subscribe((res)=>{
        if(res){
          this.router.navigate(['/pharma'])
        }
      })
    })
    this.store.select((state: any) =>{
      return state.user.name + ' ' + state.user.surname
    }).subscribe((res)=>{
      this.fullName = res
    })
    this.subscription.add(this.store.select((state: any)=>{
      let newJob!:jobPostModel

      switch(this.childrenPath){
        case 'homePage':
          const categoriesHome: filterConditions[] = state.jobpost.JobPost;
          const jobPostHome: any = categoriesHome.find((job)=>{
            return job.CategorySymbol == this.categorySymbol
          })          
          newJob = jobPostHome?.content?.find((profile: any) =>{
              return profile.custom_doc_id == this.id
          })
          break;
        case 'jobs-list':
          const categories: filterConditions[] = state.jobpost.JobPost;
          const jobPost: any = categories.find((job)=>{
            return job.CategorySymbol == this.categorySymbol
          })          
          newJob = jobPost?.allContent?.find((profile: any) =>{
              return profile.custom_doc_id == this.id
          })
          break;
        case 'recently-seen-job':
          newJob = state?.recentlySeen?.find((profile: any) =>{
              return profile.custom_doc_id == this.id
          })
          break;
        case 'notification':
          newJob = state.notifications.job.content
          break;
        case 'request-jobs':
          newJob = state.jobpost.JobRequests[this.id + '-' + state.user.uid].JobPost
          break;
        case 'bookmark':
          newJob = state.jobpost.Bookmarks[this.id + '-' + state.user.uid].JobPost
          break;
        case 'operator-page':
          if(this.route.snapshot.queryParamMap.get('operatorExistFlag') !== null){
            const flag = this.route.snapshot.queryParamMap.get('operatorExistFlag') == 'true'? true: false
            if(flag){ 
              const categorySymbol = this.route.snapshot.queryParamMap.get('jobType') == 'ร้านยาทั่วไป' || this.route.snapshot.queryParamMap.get('jobType')! == 'ร้านยาแบรนด์' || this.route.snapshot.queryParamMap.get('jobType')! == 'โรงพยาบาล'? 'BA' : 'CB'
              const operatorUID = this.route.snapshot.queryParamMap.get('operatorUID')
              const filter : filterConditions = state.jobpost.JobPost.find((filter:filterConditions)=>{
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
    }).subscribe((res: jobPostModel)=> {
      if(res !== undefined) {
        if(Object.keys(res).length <= 24){
          this.jobPostService.getJob(this.id).then((job: jobPostModel)=>{
            switch(this.childrenPath){
              case 'homePage':
                this.store.dispatch(updateJobFromHome({categorySymbol:this.categorySymbol, jobUID: this.id, jobPayload: job}))
                break;
              case 'recently-seen-job':
                this.store.dispatch(updateRecentlySeenJob({jobUID: this.id, JobPost:job}))
                break;
              case 'jobs-list':
                  this.store.dispatch(updateJobFromJobCategory({categorySymbol:this.categorySymbol, jobUID: this.id, jobPayload: job}))
              break;
            }
            this.profile = job;
            this.profileHeader = {
              Establishment: this.profile.Establishment,
              JobType: this.profile.JobType
            }
            this.loadingFlag = false
          })
        }else{
          this.profile = res;
          this.profileHeader = {
            Establishment: this.profile.Establishment,
            JobType: this.profile.JobType
          }
          this.loadingFlag = false
        }
        if(this.profile._geoloc !== undefined){
          this.center = this.profile._geoloc
          this.markerPosition = this.center
        }
        this.subscription.add(this.store.select((state:any)=>{
          return state.urgentJobs.urgentJobs
        }).subscribe((urgentJobs: any)=>{
          if(urgentJobs.length == 0 && this.detailLeavingFlag && this.profile.Urgency){
            this.jobPostService.getUrgentJobOfOperator(this.profile.OperatorUID).then((jobs:jobPostModel[]) =>{
              if(jobs.length !== 0){
                this.store.dispatch(getUrgentJobsSuccess({jobs: jobs}));
              }
              this.urgentJobs = jobs;
            })
          }
        }))
      }
    }));
    this.bookmarkFlag$ = this.store.select((state: any) =>{
      let flag = true;
      if(this.userID !== ''){
        const newState: AppState = state.jobpost
        const bookmark: Bookmark = newState.Bookmarks[this.profile.custom_doc_id + '-' + this.userID]
        if(bookmark === undefined){
          flag = false;
        }else{
          this.bookmarkID = bookmark.bookmarkUID!
        }
        this.localFlag = flag;
      }
      return flag 
    })
    this.requestFlag$ = this.store.select((state:any)=>{
      return state.jobpost.JobRequests[this.profile.custom_doc_id + '-' + this.userID] !== undefined?true:false
    })
    this.scrollUp();
  }

  onClose(){
    this.formModal.hide()
  }

  requestJob(){
    if(localStorage.getItem('loginState') == 'false'){
      this.router.navigate(['pharma/login'])
    }else{
      this.successFlag = false
      this.loadingConfirmRequestFlag = false
      this.formModal.show()
    }
  }
  
  requestJobConfirm(){
      this.loadingConfirmRequestFlag = true
      this.jobPostService.requestJob(this.fullName, this.profileImageUrl, this.profile.custom_doc_id, this.profile.OperatorUID, this.userID).then((value: any)=>{
        this.loadingConfirmRequestFlag = false
        this.successFlag = true
        const jobRequest:jobRequest = {
          operatorUID: this.profile.OperatorUID,
          userUID: this.userID,
          jobUID: this.profile.custom_doc_id,
          JobPost:this.profile,
          custom_doc_id: value.id
        }
        this.utilService.sendListenJobRequest(jobRequest)
      })
  }
  
  getBookmarkPayload(){
    return {jobUID: this.profile.custom_doc_id, userUID: this.userID, bookmarkUID: this.bookmarkID, JobPost:this.profile};
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  toggleBookmark(){
    if(localStorage.getItem('loginState') === 'true'){
      this.bookmarkLoadingFlag = true
      if(this.localFlag === true){
        this.jobPostService.removeBookMarkService(this.bookmarkID).then((value: any)=>{
          this.store.dispatch(removeBookmark(this.getBookmarkPayload()));
          this.bookmarkLoadingFlag = false
        })
      }else{
        this.jobPostService.addBookmarkService(this.profile.custom_doc_id,this.userID).then((value)=>{
          this.bookmarkID = value.id
          this.utilService.sendListenJobBookmark(this.getBookmarkPayload())
          this.bookmarkLoadingFlag = false
        })
      }
    }
  }

  acceptJob(){
    if(localStorage.getItem('loginState') == 'false'){
      this.router.navigate(['login'])
    }
  }
  toggleShare(){
    this.landingPageComponent.toggleShare(this.profile)
  }
  
  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }
  
}

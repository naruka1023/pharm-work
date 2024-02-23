import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserPharma, requestView } from '../../model/user.model';
import { Observable, of } from 'rxjs';
import { UtilService } from '../../service/util.service';

@Component({
  selector: 'app-pharma-user-profile-page',
  templateUrl: './pharma-user-profile-page.component.html',
  styleUrls: ['./pharma-user-profile-page.component.css']
})
export class PharmaUserProfilePageComponent {
  innerProfileInformation!:UserPharma
  jobType!: string[]
  categorySymbol!: string
  profileLinkPage: boolean = true
  jobUID?: string
  requestUID?: string
  zoom: number = 15
  requestViewFlag$: Observable<boolean> = of(true)
  userUID!: string
  pageType!: string
  sendUrgentJobsFlag!: boolean;
  requestStatus!: requestView;
  urgentJobObject: any = {};
  constructor(private route:ActivatedRoute, private store:Store, private profileService: UtilService){}

  ngOnInit(){
    this.categorySymbol = this.route.snapshot.queryParamMap.get('categorySymbol')!;
    this.userUID = this.route.snapshot.queryParamMap.get('userUID')!;
    this.pageType = this.route.snapshot.queryParamMap.get('pageType')!;
    this.jobUID = this.route.snapshot.queryParamMap.get('jobUID')!;
    this.requestUID = this.route.snapshot.queryParamMap.get('requestUID')!;
    this.profileLinkPage = (this.route.snapshot.queryParamMap.get('profileLinkPage')! == 'true')?true:false
    this.requestViewFlag$ = this.store.select((state: any) =>{
      let flag = true;
      
      if(this.userUID !== ''){
        let requestView: requestView = state.requestView[this.userUID + '-' + state.user.uid]
        if(requestView === undefined){
          flag = false;
        }else{
          this.requestStatus = requestView
        }
      }
      (flag)
      return flag 
    })
    this.store.select((state:any)=>{
      let newState: any
      switch(this.pageType){
        case 'recently-seen':
          newState = state.recentlySeen.find((user: UserPharma)=>{
            return user.uid == this.userUID
          })
          return newState        
        case 'notification':
          newState = state.notifications.user.content
          return newState
        case 'favorites':
          newState = state.users.Favorites[state.user.uid + '-' + this.userUID]
          newState = newState.content
          return newState
        case 'request-jobs':
          if(this.profileLinkPage){
            newState = state.requestView[this.userUID + '-' + state.user.uid]
            newState = newState.content
            return newState
          }else{
            newState = state.requestedJobs.JobRequests[this.jobUID!].users[this.requestUID! + '-' + this.userUID]
            return newState
          }
        default:
          newState = state.users.users[this.categorySymbol][this.pageType]
          newState = newState[this.userUID]
          return newState        
      }
    }).subscribe((profile: UserPharma)=>{
      
      this.innerProfileInformation = profile
      this.sendUrgentJobsFlag = false;
      this.innerProfileInformation.preferredJobType!.forEach((jobType: string)=>{
        if(jobType == 'งานด่วนรายวัน'){
          this.sendUrgentJobsFlag = true
        }
      })
      if(this.sendUrgentJobsFlag){
        this.urgentJobObject = {
          icon: 'bi bi-calendar-check',
          text: 'เภสัชกรท่านนี้สนใจรับงานด่วน ท่านสามารถกดปุ่ม ส่งงานด่วน ที่ด้านบนเพื่อส่งประกาศงานด่วนให้เภสัชกรท่านนี้ได้โดยตรง'
        }
      }else{
        this.urgentJobObject = {
          icon: 'bi bi-calendar-x',
          text: 'เภสัชกรท่านนี้ยังไม่สนใจรับงานด่วนในขณะนี้'
        }
      }
      this.jobType = profile.preferredJobType!
    })
    this.scrollUp()
  }

  openRequestViewModal(){
    this.profileService.sendRequestViewSubject(this.innerProfileInformation)
  }

  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }
}

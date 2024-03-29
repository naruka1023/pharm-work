import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { AppState, Favorite, UserPharma, requestView } from '../../model/user.model';
import { UsersService } from '../../service/users.service';
import { addRecentlySeen } from '../../state/actions/recently-seen.actions';
import { removeFavorite, addFavorites } from '../../state/actions/users-actions';
import { UtilService } from '../../service/util.service';
import { removeRequestView } from '../../state/actions/request-view.actions';
import { RequestJobComponent } from '../../page/operator-profile/request-job/request-job.component';
import { cancelRequest, checkIfEmptyUser } from '../../state/actions/job-request-actions';

@Component({
  selector: 'app-normal-user-card',
  templateUrl: './normal-user-card.component.html',
  styleUrls: ['./normal-user-card.component.css']
})
export class NormalUserCardComponent {
  @Input()content!: UserPharma
  @Input()type: string = 'AA'
  @Input()profileLinkPage: boolean = true
  @Input()jobUID?: string = ''
  @Input()requestUID?: string
  requestViewFlag$:Observable<boolean> = of(true);
  requestStatus!: requestView
  requestStatusFlag: boolean = false;
  dateSent!:string
  cancelRequestViewFlag: boolean = false;
  favoriteFlag$:Observable<boolean> = of(true);
  requestViewUID!: string
  favoriteLoadingFlag: boolean = false;
  localFlag: boolean = true;
  favoriteID!: string;
  userID!: string

  constructor(private route: ActivatedRoute, private requestJobsComponent: RequestJobComponent,private utilService: UtilService, private router: Router,private userService: UsersService, private store: Store){}

  ngOnInit(){
    this.store.select((state: any)=>{
      return state.user.uid
    }).subscribe((value)=>{
      if(value !== ''){
        this.userID = value
      }
    })
    

    this.requestViewFlag$ = this.store.select((state: any) =>{
      let flag = true;
      
      
      if(this.userID !== ''){
        let requestView: requestView = state.requestView[this.content.uid + '-' + this.userID]
        if(requestView === undefined){
          flag = false;
        }else{
          if(this.router.url.indexOf("/operator/profile-operator/request-jobs") !== -1){
            this.requestStatusFlag = true
          }
          this.requestStatus = requestView
          this.requestViewUID = requestView.requestViewUID!
        }
      }
      return flag 
    })
    this.favoriteFlag$ = this.store.select((state: any) => {
      let flag = true;
      if(this.userID !== ''){
        let newState: AppState = state.users
        let favorite: Favorite = newState.Favorites[this.userID + '-' + this.content.uid]
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

  deleteRequestView(){
    this.cancelRequestViewFlag = true
    this.userService.removeRequestView(this.requestStatus.requestViewUID!).then(()=>{
      this.cancelRequestViewFlag = false
      this.store.dispatch(removeRequestView({requestView:this.requestStatus}))
    })
  }

  cancelRequest(){
    this.userService.cancelRequest(this.content.requestUID!).then(()=>{
      // this.store.dispatch(cancelRequest({requestUID: this.content.requestUID!, jobUID: this.jobUID!, userUID: this.content.uid}))
      // this.store.dispatch(checkIfEmptyUser({jobUID: this.jobUID!}))
    })
  }

  openRequestViewModal(){
    this.utilService.sendRequestViewSubject(this.content)
  }

  goToProfile(){
    if(!this.profileLinkPage){
      this.requestJobsComponent.hideModal()
    }
    let pageType = 'long'
    switch(this.router.url.split('?')[0]){
      case '/operator/profile-operator/recently-seen-users':
        pageType = 'recently-seen'
        break;
      case '/operator/profile-operator/favorites':
        pageType = 'favorites'
      break;
      case '/operator/profile-operator/request-jobs':
        pageType = 'request-jobs'
      break;
      default:
        this.store.dispatch(addRecentlySeen({user: this.content}));
    }
    this.router.navigate(['/operator/pharma-user-profile'], {
      queryParams: 
      {
        userUID: this.content.uid,
        categorySymbol:this.type,
        pageType:pageType,
        profileLinkPage: this.profileLinkPage,
        requestUID: this.content.requestUID,
        jobUID: this.jobUID
      }
    })
  }
  getFavoritePayload(){
    return {operatorUID: this.userID, user:this.content, favoriteUID:this.favoriteID}
  }
  toggleFavorite(){
    this.favoriteLoadingFlag = true
    if(this.localFlag === true){
      this.userService.removeFavorite(this.favoriteID).then((value: any)=>{
        this.store.dispatch(removeFavorite({operatorUID: this.userID, userUID:this.content.uid}));
        this.favoriteLoadingFlag = false
        this.localFlag = false
      })
    }else{
      this.userService.addFavorite(this.userID,this.content.uid).then((value)=> {
        this.favoriteID = value.id
        this.store.dispatch(addFavorites(this.getFavoritePayload()))
        this.favoriteLoadingFlag = false
        this.localFlag = true;
      })
    }
  }
}

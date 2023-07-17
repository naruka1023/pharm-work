import { AfterViewInit, Component, Input } from '@angular/core';
import { userOperator } from '../../model/typescriptModel/jobPost.model';
import { removeFollowers } from '../../state/actions/job-post.actions';
import { Store } from '@ngrx/store';
import { JobPostService } from '../../service/job-post.service';
import { Router } from '@angular/router';
import { requestView } from '../../model/typescriptModel/users.model';
import { UtilService } from '../../service/util.service';
import { UserServiceService } from '../../service/user-service.service';
import { removeRequestView } from '../../state/actions/request-view.actions';
declare var window: any;

@Component({
  selector: 'app-operator-normal-card',
  templateUrl: './operator-normal-card.component.html',
  styleUrls: ['./operator-normal-card.component.css']
})
export class OperatorNormalCardComponent{
  constructor(private userService: UserServiceService, private store:Store, private jobPostService: JobPostService, private router: Router, private utilService: UtilService){}
 
  @Input()content!: userOperator
  @Input()followerUID: string = '';
  @Input()requestViewFlag: boolean = false;
  localFlag: any;
  formModal: any;

  target: string = "mouseTarget" + this.followerUID
  loadingConfirmRequestFlag: boolean = false
  successFlag: boolean = false
  followedText: string = 'ติดตามแล้ว'

  requestStatus!: requestView
  requestViewLoading: boolean = false
  followLoading: boolean = false;
  userUID!: string;
  operatorUID!: string;

  ngOnInit(){
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('confirmRequestView')
      );
    if(this.content.cropProfilePictureUrl == ''){
      delete this.content.cropProfilePictureUrl
    }
    this.operatorUID = this.content.uid
    this.store.select((state: any) => {
      if(state.user.uid !== ''){
        return state.user.uid 
      }
      return ''
    }).subscribe((userUID: string)=>{
      this.userUID = userUID
    })
    this.store.select((state: any)=>{
      return state.requestView[this.userUID + '-' + this.operatorUID]
    }).subscribe((requestView: requestView) =>{
      this.requestStatus = requestView
    })
  }

  changeFollowedText(text:string){
    this.followedText = text;
  }

  onClose(){
    this.formModal.hide()
  }

  
  revealText(){
    this.utilService.sendRequestViewSubject(this.requestStatus)
  }

  confirmRequestView(){
    this.formModal.show()
  }

  completeConfirmRequestView(){
    this.loadingConfirmRequestFlag = true
    this.formModal.hide()
    this.userService.confirmRequestView(this.requestStatus).then(()=>{
      this.loadingConfirmRequestFlag = false
      this.successFlag = true
    })
  }

  removeRequestView(){
    this.requestViewLoading = true
    this.userService.removeRequestView(this.requestStatus.requestViewUID!).then(()=>{
      this.store.dispatch(removeRequestView({requestView:this.requestStatus}))
      this.requestViewLoading = false
    })
  }

  goToOperatorProfile(){
    this.router.navigate(['/pharma/operator-page'], {
      queryParams: 
      {
        operatorUID: this.operatorUID,
        followFlag: !this.requestViewFlag,
        requestViewFlag: this.requestViewFlag,
        operatorExistFlag: false,
        jobType: this.content.jobType
      }
    })
  }


  
  unFollowOperator(){
    this.followLoading = true
    this.jobPostService.unfollowOperator(this.followerUID).then(()=>{
      this.followLoading = false
      this.store.dispatch(removeFollowers({userUID:this.userUID, operatorUID: this.operatorUID}))
    });
  }

}

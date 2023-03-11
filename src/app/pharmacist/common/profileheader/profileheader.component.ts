import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { profileHeaderJobPost, profileHeaderOperator, profileHeaderPharma } from '../../model/typescriptModel/header.model';
import { AppState, Follow, jobPostModel, userOperator } from '../../model/typescriptModel/jobPost.model';
import { User } from '../../model/typescriptModel/users.model';
import { JobPostService } from '../../service/job-post.service';
import { UserServiceService } from '../../service/user-service.service';
import { addFollowers, removeFollowers, setOperatorData } from '../../state/actions/job-post.actions';

@Component({
  selector: 'app-profileheader',
  templateUrl: './profileheader.component.html',
  styleUrls: ['./profileheader.component.css']
})
export class ProfileheaderComponent {
@Input() profileInformation!: profileHeaderJobPost | profileHeaderPharma | profileHeaderOperator
@Input() profileType! : string;
@Input() viewFlag = true;
result!: any
profileInformation$!: User
headerInformation!: Observable<profileHeaderPharma>
id!: string
categorySymbol!: string
followFlag$!: Observable<boolean>
followLoading: boolean = false;
sub: Subscription = new Subscription();
operatorUID!: string
userUID!: string
loading$!:Observable<boolean>
localFlag: boolean = true
operator!:userOperator;
followerUID!: string
constructor(private store: Store, private userService:UserServiceService,private jobPostService:JobPostService, private router:Router, private route: ActivatedRoute,){}

  ngOnInit(){
    this.store.select((state: any)=>{
      return state.user.uid
    }).subscribe((value)=>{
      if(value !== ''){
        this.userUID = value
      }
    })
    switch(this.profileType){
      case "job-post":
        this.result = this.profileInformation
        this.id = this.route.snapshot.queryParamMap.get('id')!;
        this.categorySymbol = this.route.snapshot.queryParamMap.get('categorySymbol')!;
        this.store.select((state: any)=>{
          const categories: jobPostModel[] = state.jobpost.JobPost;
          const jobPost: any = categories.find((job)=>{
            return job.CategorySymbol == this.categorySymbol
          })
          let newJob:jobPostModel = jobPost?.content?.find((profile: any) =>{
              return profile.custom_doc_id == this.id
          })
          return newJob.OperatorUID
        }).subscribe((operatorUID)=>{
          this.operatorUID = operatorUID; 
        })
        this.loading$ = this.store.select((state:any) =>{
          return state.jobpost.loadingOperator
        })
        this.userService.getOperatorData(this.operatorUID).subscribe((operator)=>{
          this.operator = operator.data() as userOperator
          this.store.dispatch(setOperatorData({operator:this.operator}))
        })
        break;
        case "operator-profile":
          this.operatorUID = this.route.snapshot.queryParamMap.get('operatorUID')!;

          this.store.select((state:any)=> {
            return state.jobpost.operator
          }).subscribe((operator)=>{
          this.operator =  operator;
          this.operatorUID = operator.uid;
          this.result = {
            name: operator.companyName!,
            JobType: operator.jobType!,
            Location: {
                Section: operator.Location!.Section,
                District: operator.Location!.District,
                Province: operator.Location!.Province
            }
          }
        })
        break;
      case "pharmacist-profile":
        this.headerInformation = this.store.select((state: any)=>{
          this.profileInformation$ = state.user;
          return{
            name: this.profileInformation$.name!,
            Location: this.profileInformation$.Location,
          }
        })
        this.headerInformation.subscribe((header)=>{
          this.result = header;
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
      }
    })
  }
  editProfileClicked(){
    this.userService.sendEditSubject();
  }
}

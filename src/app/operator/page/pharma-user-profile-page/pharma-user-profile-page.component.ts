import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserPharma } from '../../model/user.model';

@Component({
  selector: 'app-pharma-user-profile-page',
  templateUrl: './pharma-user-profile-page.component.html',
  styleUrls: ['./pharma-user-profile-page.component.css']
})
export class PharmaUserProfilePageComponent {
  innerProfileInformation?:UserPharma
  jobType!: string[]
  categorySymbol!: string
  userUID!: string
  pageType!: string
  constructor(private route:ActivatedRoute, private store:Store){}

  ngOnInit(){
    this.categorySymbol = this.route.snapshot.queryParamMap.get('categorySymbol')!;
    this.userUID = this.route.snapshot.queryParamMap.get('userUID')!;
    this.pageType = this.route.snapshot.queryParamMap.get('pageType')!;
    this.store.select((state:any)=>{
      let newState: any
      switch(this.pageType){
        case 'recently-seen':
          newState = state.recentlySeen.find((user: UserPharma)=>{
            return user.uid == this.userUID
          })
          return newState        
        case 'favorites':
          newState = state.users.Favorites[state.user.uid + '-' + this.route.snapshot.queryParamMap.get('userUID')]
          newState = newState.content
          return newState
        default:
          newState = state.users.users[this.categorySymbol][this.pageType]
          newState = newState[this.userUID]
          return newState        
      }
    }).subscribe((profile: UserPharma)=>{
      this.innerProfileInformation = profile
      this.jobType = profile.preferredJobType!
    })
    this.scrollUp()
  }
  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }
}

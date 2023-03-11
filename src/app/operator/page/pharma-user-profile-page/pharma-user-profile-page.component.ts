import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { profileHeaderPharma } from '../../model/header.model';
import { UserPharma } from '../../model/user.model';

@Component({
  selector: 'app-pharma-user-profile-page',
  templateUrl: './pharma-user-profile-page.component.html',
  styleUrls: ['./pharma-user-profile-page.component.css']
})
export class PharmaUserProfilePageComponent {
  innerProfileInformation?:UserPharma
  header!: profileHeaderPharma;
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
      if(this.pageType == 'recently-seen'){
        let newState = state.recentlySeen.find((user: UserPharma)=>{
          return user.uid == this.userUID
        })
        return newState        
      }else{
        let newState = state.users.users[this.categorySymbol][this.pageType]
        newState = newState[this.userUID]
        return newState        
      }
    }).subscribe((profile: UserPharma)=>{
      this.header =  {
      name: profile.name,
      Location: {
          Section: profile.Location!.Section,
          District: profile.Location!.District,
          Province: profile.Location!.Province
        }  
      }
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

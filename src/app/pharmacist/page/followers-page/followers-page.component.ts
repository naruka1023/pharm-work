import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FollowList, userOperator } from '../../model/typescriptModel/jobPost.model';

@Component({
  selector: 'app-followers-page',
  templateUrl: './followers-page.component.html',
  styleUrls: ['./followers-page.component.css']
})
export class FollowersPageComponent {

  followers$!:Observable<userOperator[]>
  emptyFlag$!: Observable<boolean>

  constructor(private store:Store){}
  ngOnInit(){
    this.followers$ = this.store.select((state:any)=>{
      let Followers:FollowList = state.jobpost.Follows;
      let followersArray = [];
      for(const [key, value] of Object.entries(Followers)){
        followersArray.push(value.user as userOperator)
      }
      return followersArray
    })
    this.emptyFlag$ = this.store.select((state: any)=>{
      return Object.keys(state.jobpost.Follows).length === 0
    })
  }
}

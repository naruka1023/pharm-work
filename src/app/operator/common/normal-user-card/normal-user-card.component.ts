import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { AppState, Favorite, UserPharma } from '../../model/user.model';
import { UsersService } from '../../service/users.service';
import { addRecentlySeen } from '../../state/actions/recently-seen.actions';
import { removeFavorite, addFavorites } from '../../state/actions/users-actions';

@Component({
  selector: 'app-normal-user-card',
  templateUrl: './normal-user-card.component.html',
  styleUrls: ['./normal-user-card.component.css']
})
export class NormalUserCardComponent {
  @Input()content!: UserPharma
  @Input()type: string = 'AA'
  @Input()profileLinkPage: boolean = true
  favoriteFlag$:Observable<boolean> = of(true);
  favoriteLoadingFlag: boolean = false;
  localFlag: boolean = true;
  favoriteID!: string;
  userID!: string

  constructor(private router:Router,private userService: UsersService, private store:Store){}

  ngOnInit(){
    this.store.select((state: any)=>{
      return state.user.uid
    }).subscribe((value)=>{
      if(value !== ''){
        this.userID = value
      }
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
  goToProfile(){
    let pageType = 'long'
    if(this.router.url !== '/operator/profile-operator/recently-seen-users'){
      this.store.dispatch(addRecentlySeen({user: this.content}));
      pageType = 'recently-seen'
    }
    this.router.navigate(['/operator/pharma-user-profile'], {
      queryParams: 
      {
        userUID: this.content.uid,
        categorySymbol:this.type,
        pageType:'recently-seen'
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

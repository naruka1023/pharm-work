import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { AppState, Favorite, UserPharma, requestView } from '../../model/user.model';
import { UsersService } from '../../service/users.service';
import { addRecentlySeen } from '../../state/actions/recently-seen.actions';
import { addFavorites, removeFavorite } from '../../state/actions/users-actions';
import { UtilService } from '../../service/util.service';

@Component({
  selector: 'app-small-user-card',
  templateUrl: './small-user-card.component.html',
  styleUrls: ['./small-user-card.component.css']
})
export class SmallUserCardComponent {
  @Input()content!: UserPharma;
  @Input() type!: string;
  favoriteFlag$:Observable<boolean> = of(true);
  requestViewFlag$:Observable<boolean> = of(true);
  requestViewUID!: string
  requestStatus!: requestView
  favoriteLoadingFlag!: boolean;
  localFlag: boolean = true;
  formModal!: any;
  favoriteID!: string;
  userID!: string
  profilePictureID!: string;

  constructor(private utilService:UtilService, private userService: UsersService, private store:Store, private router:Router){}

  ngOnInit(){
    this.profilePictureID = `profilePicture${this.content.uid}`
    this.store.select((state: any)=>{
      return state.user.uid
    }).subscribe((value)=>{
      if(value !== ''){
        this.userID = value
      }
    })
    // const ref = this.storage.ref(`users/${this.content.uid}/profile-picture`);
    // console.log(`${this.content.name} begin upload`)
    // ref.getDownloadURL().subscribe((url:string)=>{
    //   const img = document.getElementById(this.profilePictureID);
    //   img!.setAttribute('src', url);
    //   console.log(`${this.content.name} upload successful`)
    // }, (error:any)=>{
    //   console.log(error)
    // });
    this.requestViewFlag$ = this.store.select((state: any) =>{
      let flag = true;
      if(this.userID !== ''){
        let requestView: requestView = state.requestView[this.content.uid + '-' + this.userID]
        if(requestView === undefined){
          flag = false;
        }else{
          this.requestStatus = requestView
          this.requestViewUID = requestView.requestViewUID!
        }
      }
      return flag 
    })
    this.favoriteFlag$ = this.store.select((state: any) =>{
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
    this.store.dispatch(addRecentlySeen({user: this.content}));
    this.router.navigate(['/operator/pharma-user-profile'], {
      queryParams: 
      {
        userUID: this.content.uid,
        categorySymbol:this.type,
        pageType:'short'
      }
    })
  }
  openRequestViewModal(){
    this.utilService.sendRequestViewSubject(this.content)
  }
  getFavoritePayload(){
    return {operatorUID: this.userID, user:this.content, favoriteUID:this.favoriteID}
  }

  toggleFavorite(){
    if(this.localFlag === true){
      this.favoriteLoadingFlag = true
      this.userService.removeFavorite(this.favoriteID).then((value: any)=>{
        this.store.dispatch(removeFavorite({operatorUID: this.userID, userUID:this.content.uid}));
        this.favoriteLoadingFlag = false
      })
    }else{
      this.favoriteLoadingFlag = true
      this.userService.addFavorite(this.userID,this.content.uid).then((value)=> {
        this.favoriteID = value.id
        this.store.dispatch(addFavorites(this.getFavoritePayload()))
        this.favoriteLoadingFlag = false
        this.localFlag = false;
      })
    }
  }
}

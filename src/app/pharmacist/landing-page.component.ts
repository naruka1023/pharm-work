import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from './model/typescriptModel/users.model';
import { JobPostService } from './service/job-post.service';
import { UserServiceService } from './service/user-service.service';
import { getBookmarks, emptyBookmark } from './state/actions/job-post.actions';
import { removeRecentlySeen } from './state/actions/recently-seen.actions';
import { getCurrentUser, setCurrentUser, removeCurrentUser } from './state/actions/users.action';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  
  loginFlag: boolean = false;
  subject!: Subscription;
  constructor(private jobPostService:JobPostService,private store: Store ,private userService: UserServiceService,private route: Router, private auth: AngularFireAuth, private db: AngularFirestore, private modalService: NgbModal) {

  }
  
  ngOnInit(){
    this.store.select((state: any)=>{
      return state.recentlySeen
    }).subscribe((recentlySeen)=>{
      if(recentlySeen.length > 10){
        this.store.dispatch(removeRecentlySeen());
      }
    })

    this.auth.user.subscribe((user)=>{
      if(user){
        this.userService.getUser(user.uid);
        this.store.dispatch(getCurrentUser({uid:user.uid}));
        this.store.dispatch(getBookmarks({userUID:user.uid}))
        this.loginFlag = true;
        localStorage.setItem('loginState', 'true')
      }else{
        const emptyUser: User = {
          role: '',
          email: '',
          uid: '',
          license: '',
          name: '',
          surname: ''
        };
        this.store.dispatch(setCurrentUser({user: emptyUser}));
        this.store.dispatch(emptyBookmark());
        this.loginFlag = false;
        localStorage.setItem('loginState', 'false')
        this.route.navigate(['pharma'])
      }
    })
    this.loginFlag = (localStorage.getItem('loginState') === null || localStorage.getItem('loginState') === 'false')? false: true 
  }

  signOut(){
    if(this.route.url == '/pharma'){
      this.route.navigate(['pharma']).then(()=>{
          this.confirmSignout();
      })
    }else{
      this.route.navigate(['pharma']).then((bool:boolean)=>{
        if(bool){
          this.confirmSignout();
        }
      })
    }
  }
  
  confirmSignout(){
    this.auth.signOut();
    this.store.dispatch(removeCurrentUser());
  }

  redirectToList(categorySymbol: string){
    if(localStorage.getItem('loginState') == 'true'){
      this.route.navigate(['jobs-list'],
      {
        queryParams: 
        {
          CategorySymbol: categorySymbol,
        }
      })
    }else{
      this.route.navigate(['login'])
    }
  }

  onActivate() {
    // window.scroll(0,0);
 
    window.scroll({ 
            top: 0, 
            left: 0, 
            behavior:"auto"
     });
 }


}

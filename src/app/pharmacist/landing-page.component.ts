import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from './model/typescriptModel/users.model';
import { JobPostService } from './service/job-post.service';
import { UserServiceService } from './service/user-service.service';
import { getBookmarks, emptyBookmark } from './state/actions/job-post.actions';
import { removeRecentlySeen } from './state/actions/recently-seen.actions';
import { getCurrentUser, setCurrentUser, removeCurrentUser } from '../state/actions/users.action';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  
  loginFlag: boolean = false;
  subject!: Subscription;
  constructor(private activatedRoute:ActivatedRoute,private store: Store ,private route: Router, private auth: AngularFireAuth) {

  }
  
  ngOnInit(){
    
    this.store.select((state: any)=>{
      return state.recentlySeen
    }).subscribe((recentlySeen)=>{
      if(recentlySeen.length > 10){
        this.store.dispatch(removeRecentlySeen());
      }
    })

    this.subject = this.auth.user.subscribe((user)=>{
      if(user){
        this.store.dispatch(getBookmarks({userUID:user.uid}))
        this.loginFlag = true;
      }else{
        this.store.dispatch(emptyBookmark());
      }
    })
    this.loginFlag = (localStorage.getItem('loginState') === null || localStorage.getItem('loginState') === 'false')? false: true 
  }
  

  signOut(){
    if(this.route.url == '/pharma'){
      this.route.navigate(['']).then(()=>{
          this.confirmSignout();
      })
    }else{
      this.route.navigate(['']).then((bool:boolean)=>{
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
        relativeTo:this.activatedRoute,
        queryParams: 
        {
          CategorySymbol: categorySymbol,
        }
      })
    }else{
      this.route.navigate(['login'],
      {
        relativeTo:this.activatedRoute
      })
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

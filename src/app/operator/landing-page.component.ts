import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { getStorage, ref } from 'firebase/storage';
import { Subscription } from 'rxjs';
import { removeCurrentUser } from '../state/actions/users.action';
import { JobService } from './service/job.service';
import { UsersService } from './service/users.service';
import { emptyRequestedJobs } from './state/actions/job-request-actions';
import { removeRecentlySeen } from './state/actions/recently-seen.actions';
import { clearFavorites, setFavorites } from './state/actions/users-actions';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  subject!:Subscription

  constructor(private userService:UsersService, private route:Router, private auth:AngularFireAuth, private store:Store){}

  ngOnInit(){
    this.subject = this.auth.user.subscribe((user)=>{
      // this.db.collection('job-post').get().subscribe((docs)=>{
      //   docs.forEach((doc:any)=>{
      //     this.db.collection('job-post').doc(doc.id).update({
      //       coverPhotoPictureUrl:"https://firebasestorage.googleapis.com/v0/b/pharm-work.appspot.com/o/placeholder%2Fcover-photo?alt=media&token=e76b82e2-cf52-45d3-940a-96086661de07",
      //       coverPhotoOffset:0
      //     }).then(()=>{
      //       console.log(`update ${doc.id} successful`)
      //     })
      //   })
      // })
      if(user){
        this.store.select((state: any)=>{
          return state.recentlySeen
        }).subscribe((recentlySeen: any)=>{
          if(recentlySeen.length > 10){
            this.store.dispatch(removeRecentlySeen());
          }
        })
        this.userService.getFavorites(user.uid).subscribe((favorites1: any)=>{
          this.userService.getListOfUsersFromFavorites(favorites1).subscribe((favorites)=>{
            this.store.dispatch(setFavorites({favorites:favorites as any}))
          })
        })
      }else{
        this.store.dispatch(clearFavorites());
        this.store.dispatch(emptyRequestedJobs());
      }
    })
  }

  goToAddJob(urgencyFlag:boolean){
    this.route.navigate(['/operator/add-new-jobs'], {
      queryParams: 
      {
        urgency: urgencyFlag
      }
    })
  }
  signOut(){
    if(this.route.url == '/operator'){
      this.route.navigate(['operator']).then(()=>{
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
}

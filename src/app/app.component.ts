import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, Subscription} from 'rxjs';
import { User } from './pharmacist/model/typescriptModel/users.model';
import { JobPostService } from './pharmacist/service/job-post.service';
import { UserServiceService } from './pharmacist/service/user-service.service';
import { getBookmarks, emptyBookmark } from './pharmacist/state/actions/job-post.actions';
import { removeDefaultKey } from './state/actions/address.action';
import { getCurrentUser, setCurrentUser } from './state/actions/users.action';
declare var bootstrap: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private store: Store ,private route: Router, private auth: AngularFireAuth) {}
  role!: string
  ngOnInit(){
    
    this.store.dispatch(removeDefaultKey())
    this.store.select((state: any)=>{
      return state.user.role
    }).subscribe((role)=>{
      if(role !== ''){
        if(role == 'เภสัชกร'){
          this.route.navigate(['pharma']);
        }else{
          this.route.navigate(['operator']);
        }
      }
    })
    this.auth.user.subscribe((user)=>{
      if(user){
        this.store.dispatch(getCurrentUser({uid:user.uid}));
        localStorage.setItem('loginState', 'true')
      }else{
        const emptyUser: User = {
          role: '',
          email: '',
          uid: '',
          license: '',
          name: '',
          surname: '',
          showProfileFlag: true,
          loading:true
        };
        this.store.dispatch(setCurrentUser({user: emptyUser}));
        localStorage.setItem('loginState', 'false')
        this.route.navigate(['pharma'])
      }
    })
  }

}

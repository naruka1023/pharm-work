import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RoutingService } from '../service/routing.service';
import { setLogin } from '../state/actions/job-post.actions';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private auth: AngularFireAuth, private store: Store){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let loginFlag: boolean = true

      this.auth.onAuthStateChanged((user)=>{
        loginFlag = (user)? true: false;
        this.store.dispatch(setLogin({loginState: loginFlag}));
      })
      return true;
  }
  
}

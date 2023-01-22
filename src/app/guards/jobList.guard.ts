import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RoutingService } from '../service/routing.service';
import { setLogin } from '../state/actions/job-post.actions';

@Injectable({
  providedIn: 'root'
})
export class JobListGuard implements CanActivate {
  constructor(private auth: AngularFireAuth, private route: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let loginFlag: boolean = false
      this.auth.user.subscribe((user)=>{
        if(user){
          return true
        }else{
          this.route.navigate(['login']);
          return false
        }
      })
      return false;
  }
  
}

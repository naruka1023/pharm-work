import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setURL } from '../state/actions/operator-profile.actions';

@Injectable({
  providedIn: 'root'
})
export class ProfileOperatorGuard implements CanActivate {
  constructor(private store:Store){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.store.dispatch(setURL({url:state.url.split('/')[3]}))
      if(state.url.indexOf('scrollFlag') !== -1){
        route.data = {
          scrollFlag: true,
        }
      }
    return true;
  }
  
}

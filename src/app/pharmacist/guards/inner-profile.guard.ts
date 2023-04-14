import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setURL } from '../state/actions/operator-profile.actions';

@Injectable({
  providedIn: 'root'
})
export class InnerProfileGuard implements CanActivate {
  constructor(private store: Store){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    route.data = {
      scrollFlag: state.url.split('/')[3] !== 'inner-profile'? true: false
    }
    if(localStorage.getItem('loginState') == 'true'){
      this.store.dispatch(setURL({url:state.url.split('/')[3]}))
      return true;
    }
    return false;
  }
  
}

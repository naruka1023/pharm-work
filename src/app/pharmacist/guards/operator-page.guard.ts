import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { emptyOperatorData } from '../state/actions/job-post.actions';

@Injectable({
  providedIn: 'root'
})
export class OperatorPageGuard implements CanDeactivate<unknown> {
  constructor(private store:Store){}
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.store.dispatch(emptyOperatorData());
    return true;
  }
  
}

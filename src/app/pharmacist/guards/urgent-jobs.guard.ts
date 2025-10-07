import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { emptyUrgentJobs } from '../state/actions/urgent-jobs.actions';

@Injectable({
  providedIn: 'root'
})
export class UrgentJobsGuard  {
  constructor(private store:Store){}
  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    component.detailLeavingFlag = false;
    this.store.dispatch(emptyUrgentJobs())
      return true;
  }
  
}

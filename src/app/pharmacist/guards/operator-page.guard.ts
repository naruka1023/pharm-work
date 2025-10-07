import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { emptyOperatorData } from '../state/actions/operator.actions';

@Injectable({
  providedIn: 'root'
})
export class OperatorPageGuard  {
  constructor(private store: Store){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
    return true;
  }
  
}

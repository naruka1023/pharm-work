import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { InnerProfileComponent } from '../page/pharma-profile/inner-profile/inner-profile.component';
import { UserServiceService } from '../service/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilePharmaGuard implements CanDeactivate<unknown> {
  constructor(private userService: UserServiceService){}
  signOutCall: boolean = true;

  canDeactivate(
    component: InnerProfileComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return true;
  }
  
}

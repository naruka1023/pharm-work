import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { InnerProfileComponent } from '../page/operator-profile/inner-profile/inner-profile.component';
import { UtilService } from '../service/util.service';

@Injectable({
  providedIn: 'root'
})
export class InnerProfileGuard  {
  constructor(private profileService:UtilService){}
  canDeactivate(
    component: InnerProfileComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return true;
  }
}

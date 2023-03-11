import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { InnerProfileComponent } from '../page/operator-profile/inner-profile/inner-profile.component';
import { UtilService } from '../service/util.service';

@Injectable({
  providedIn: 'root'
})
export class InnerProfileGuard implements CanDeactivate<unknown> {
  constructor(private profileService:UtilService){}
  canDeactivate(
    component: InnerProfileComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(component.profileEditState){
        component.openModal();
        this.profileService.sendLeaveEditSubject(nextState!.url)
      }else{
        return true;
      }
        return false;
  }
}

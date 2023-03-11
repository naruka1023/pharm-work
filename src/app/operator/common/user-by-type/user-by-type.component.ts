import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { UserPharma, UsersByType } from '../../model/user.model';
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../service/util.service';

SwiperCore.use([Navigation, Pagination, Autoplay]);


@Component({
  selector: 'app-user-by-type',
  templateUrl: './user-by-type.component.html',
  styleUrls: ['./user-by-type.component.css']
})
export class UserByTypeComponent {
  @Input()type!: string;
  @Input()title!: string;
  Users$!: Observable<UserPharma[]>;
  userFlag: boolean = true;
  userLengthFlag!:boolean

  constructor(private utilService:UtilService, private store:Store, private router:Router, private route:ActivatedRoute){}

  ngOnInit(){
    this.Users$ = this.store.select((state:any)=>{
      let user!: UserPharma[];
      let userToSelect = _.cloneDeep(state.users.users) as UsersByType;
      switch(this.type) {
        case 'S':
          user = this.utilService.convertUserPharmaListToArray(userToSelect.S.short);
          break;
          case 'AA':
          user = this.utilService.convertUserPharmaListToArray(userToSelect.AA.short);
          break;
          case 'AB':
          user = this.utilService.convertUserPharmaListToArray(userToSelect.AB.short);
          break;
          case 'AC':
          user = this.utilService.convertUserPharmaListToArray(userToSelect.AC.short);
          break;
          case 'BA':
          user = this.utilService.convertUserPharmaListToArray(userToSelect.BA.short);
          break;
          case 'BB':
          user = this.utilService.convertUserPharmaListToArray(userToSelect.BB.short);
          break;
          case 'BC':
          user = this.utilService.convertUserPharmaListToArray(userToSelect.BC.short);
          break;
          case 'CA':
          user = this.utilService.convertUserPharmaListToArray(userToSelect.CA.short);
          break;
          case 'CB':
          user = this.utilService.convertUserPharmaListToArray(userToSelect.CB.short);
          break;
          default:
          user = this.utilService.convertUserPharmaListToArray(userToSelect.AA.short);
        }
        this.userLengthFlag = user.length <= 3?true:false
        this.userFlag = user.length !== 0? true:false;
        return user;
      })
    }
    goToList(){
      this.router.navigate(['users-list'],
      {
        relativeTo:this.route,
        queryParams: 
        {
          type: this.type,
        }
      })
    }
}

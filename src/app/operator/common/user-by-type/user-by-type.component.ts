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

  constructor(private utilService:UtilService, private store:Store, private router:Router, private route:ActivatedRoute){}

  ngOnInit(){
    this.Users$ = this.store.select((state:any)=>{
      let user: UserPharma[] = []; 
      let userToSelect: any = _.cloneDeep(state.users.users) as UsersByType;
      if(userToSelect[this.type].short !== undefined){
        user = this.utilService.convertUserPharmaListToArray(userToSelect[this.type].short);
      }
      return user;
    })
    this.Users$.subscribe((user)=>{
      this.userFlag = user.length !== 0? true:false;
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

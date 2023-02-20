import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { UserPharma, UsersByType } from '../../model/user.model';
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import { ActivatedRoute, Router } from '@angular/router';

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
  constructor(private store:Store, private router:Router, private route:ActivatedRoute){}

  ngOnInit(){
    this.Users$ = this.store.select((state:any)=>{
      let user!: UserPharma[];
      let userToSelect = _.cloneDeep(state.users.users) as UsersByType;
      switch(this.type){
        case 'S':
          user = userToSelect.S.short;
          break;
          case 'AA':
          user = userToSelect.AA.short;
          break;
          case 'AB':
          user = userToSelect.AB.short;
          break;
          case 'AC':
          user = userToSelect.AC.short;
          break;
          case 'BA':
          user = userToSelect.BA.short;
          break;
          case 'BB':
          user = userToSelect.BB.short;
          break;
          case 'BC':
          user = userToSelect.BC.short;
          break;
          case 'CA':
          user = userToSelect.CA.short;
          break;
          case 'CB':
          user = userToSelect.CB.short;
          break;
          default:
          user = userToSelect.AA.short;
        }
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

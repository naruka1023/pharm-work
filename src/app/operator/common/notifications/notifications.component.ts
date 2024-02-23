import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RoutingService } from 'src/app/pharmacist/service/routing.service';
import { onSetUserNotifications } from '../../state/actions/notifications.actions.';
import { UsersService } from '../../service/users.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  userUID!: string
  type!: string;
  pageStatus: string = 'loading'
  constructor(private router: Router,private activatedRoute: ActivatedRoute, private userService: UsersService, private store:Store, private routeService: RoutingService){}
  ngOnInit(){
    this.userUID = this.activatedRoute.snapshot.queryParamMap.get('userUID')!
    this.type = this.activatedRoute.snapshot.queryParamMap.get('type')!
    switch(this.type){
      case 'user':
          this.userService.getUser(this.userUID).then((user)=>{
            if(Object.keys(user).length > 1){
              this.store.dispatch(onSetUserNotifications({user:user}));
              this.router.navigate(['/operator/pharma-user-profile'], {
                queryParams: 
                {
                  userUID: this.userUID,
                  pageType:'notification',
                  profileLinkPage: false,
                  requestUID: '',
                  jobUID: ''
                }
              })
            }else{
              this.pageStatus = 'emptyJob'
            }
        })
      break;
    }
  }
}

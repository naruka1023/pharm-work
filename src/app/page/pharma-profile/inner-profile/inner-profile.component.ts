import { Component} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/model/typescriptModel/users.model';
import { UserServiceService } from 'src/app/service/user-service.service';

@Component({
  selector: 'app-inner-profile',
  templateUrl: './inner-profile.component.html',
  styleUrls: ['./inner-profile.component.css']
})
export class InnerProfileComponent{
  
  subject!: Subscription
  innerProfileInformation!: User
  localProfileFlag: boolean = true;
  loadingFlag: boolean = true;
  firstFlag: boolean = true;
  constructor(private userService: UserServiceService, private store: Store){}
  
  ngOnInit(){
    this.store.select((state: any)=>{
      return state.user
    }).subscribe((value: any)=>{
      this.innerProfileInformation = value;
      this.loadingFlag = false;
    })
    this.subject = this.userService.getEditSubject().subscribe((value: boolean)=>{
        this.localProfileFlag = !this.localProfileFlag;
    })
  }
}

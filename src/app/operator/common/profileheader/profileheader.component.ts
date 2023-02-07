import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { profileHeaderJobPost, profileHeaderOperator } from '../../model/header.model';
import { User } from '../../model/user.model';
import { OperatorProfileComponent } from '../../page/operator-profile/operator-profile.component';
import { ProfileService } from '../../service/profile.service';

@Component({
  selector: 'app-profileheader',
  templateUrl: './profileheader.component.html',
  styleUrls: ['./profileheader.component.css']
})
export class ProfileHeaderComponent {
@Input() profileInformation!: profileHeaderJobPost | profileHeaderOperator
@Input() profileType! : string;
result!: any
profileInformation$!: User
headerInformation!: Observable<OperatorProfileComponent>

constructor(private store: Store, private profileService: ProfileService){}

  ngOnInit(){
    switch(this.profileType){
      case "job-post":
        this.result = this.profileInformation
        break;
      case "operator-profile":
        this.headerInformation = this.store.select((state: any)=>{
          this.profileInformation$ = state.user;
          return{
            name: this.profileInformation$.companyName!,
            Location: this.profileInformation$.Location,
          }
        })
        this.headerInformation.subscribe((header)=>{
          this.result = header;
        })
    }
  }
  editProfileClicked(){
    this.profileService.sendEditSubject();
  }
}

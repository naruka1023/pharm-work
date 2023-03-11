import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { profileHeaderJobPost, profileHeaderOperator, profileHeaderPharma } from '../../model/header.model';
import { User } from '../../model/user.model';
import { OperatorProfileComponent } from '../../page/operator-profile/operator-profile.component';
import { UtilService } from '../../service/util.service';

@Component({
  selector: 'app-profileheader',
  templateUrl: './profileheader.component.html',
  styleUrls: ['./profileheader.component.css']
})
export class ProfileHeaderComponent {
@Input() profileInformation!: profileHeaderJobPost | profileHeaderOperator | profileHeaderPharma
@Input() profileType! : string;
@Input() viewFlag: boolean = false;
result!: any
profileInformation$!: User
headerInformation!: Observable<profileHeaderOperator>

constructor(private store: Store, private profileService: UtilService){}

  ngOnInit(){
    switch(this.profileType){
      case "pharma-profile":
        this.result = this.profileInformation
        break;
      case "job-post":
        this.result = this.profileInformation
        break;
      case "operator-profile":
        this.headerInformation = this.store.select((state: any)=>{
          this.profileInformation$ = state.user;
          return{
            name: this.profileInformation$.companyName!,
            Location: this.profileInformation$.Location,
            JobType: this.profileInformation$.jobType!,
          }
        })
        this.headerInformation.subscribe((header)=>{
          this.result = header;
        })
    }
  }
  openPageView(){
    this.profileService.sendCallView();
  }
  editProfileClicked(){
    this.profileService.sendEditSubject();
  }
}

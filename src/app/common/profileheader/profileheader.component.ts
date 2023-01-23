import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { profileHeaderJobPost, profileHeaderPharma } from 'src/app/model/typescriptModel/header.model';
import { User } from 'src/app/model/typescriptModel/users.model';

@Component({
  selector: 'app-profileheader',
  templateUrl: './profileheader.component.html',
  styleUrls: ['./profileheader.component.css']
})
export class ProfileheaderComponent {
@Input() profileInformation!: profileHeaderJobPost | profileHeaderJobPost
@Input() profileType! : string;
result!: any
profileInformation$!: User
headerInformation!: Observable<profileHeaderPharma>

constructor(private store: Store){}

ngOnInit(){
  switch(this.profileType){
    case "job-post":
      this.result = this.profileInformation
      break;
    case "pharmacist-profile":
      this.headerInformation = this.store.select((state: any)=>{
        this.profileInformation$ = state.user;
        return{
          name: this.profileInformation$.name!,
          Location: this.profileInformation$.Location,
        }
      })
      this.headerInformation.subscribe((header)=>{
        this.result = header;
      })
  }
}
}

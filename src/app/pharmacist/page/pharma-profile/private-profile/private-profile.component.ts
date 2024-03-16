import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { User } from 'src/app/pharmacist/model/typescriptModel/users.model';
import { UserServiceService } from 'src/app/pharmacist/service/user-service.service';
import { setCurrentUser } from 'src/app/state/actions/users.action';
import { ProfileheaderComponent } from 'src/app/pharmacist/common/profileheader/profileheader.component';

@Component({
  selector: 'app-private-profile',
  templateUrl: './private-profile.component.html',
  styleUrls: ['./private-profile.component.css']
})
export class PrivateProfileComponent {
  innerProfileInformation!: User
  editFlag:boolean = false
  loadingFlag: boolean = false
  profileEdit!:FormGroup

  constructor(private store: Store, private fb: FormBuilder,  private userService: UserServiceService){
  }
  ngOnInit(){
    this.store.select((state: any)=>{
      return state.user
    }).subscribe((value: User)=>{
      this.innerProfileInformation = _.cloneDeep(value);
      if(this.innerProfileInformation.role !== ''){
        this.resetFormGroup();
      }
    })
  }

  cancelClick(){
    this.editFlag = false
    this.resetFormGroup();
  }

  editClick(){
    this.editFlag = !this.editFlag
    if(this.editFlag == false){
      this.resetFormGroup();
    }
  }

  initializeFormGroup(){
    this.profileEdit = this.fb.group({
      gender: [''],
      Location: this.fb.group({
        address: [''],
        Province: [''],
        District: [''],
        Section: [''],
      }),
      contacts: this.fb.group({
        phone: [''],
        email: [''],
        line: [''],
        facebook: [''],
      }),
      license: [''],
      active: ['true'],
    });
  }

  resetFormGroup(){
    this.initializeFormGroup();
    this.profileEdit.patchValue({
      ...this.innerProfileInformation,
    })
  }

  onSave(){
    const payload = {
      ...this.profileEdit.value,
      uid: this.innerProfileInformation.uid,
      dateUpdated: new Date().toISOString().split('T')[0],
      dateUpdatedUnix: Math.floor(new Date().getTime() / 1000)
    }
    this.loadingFlag = true
    this.userService.updateUser(payload).then(()=>{
      this.loadingFlag = false
      this.store.dispatch(setCurrentUser({user: payload}))
      this.editClick()
    })
  }
}

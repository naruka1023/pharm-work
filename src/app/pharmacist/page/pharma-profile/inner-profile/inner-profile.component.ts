import { Component} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { User } from 'src/app/pharmacist/model/typescriptModel/users.model';
import { JobTypeConverterService } from 'src/app/pharmacist/service/job-type-converter.service';
import { UserServiceService } from 'src/app/pharmacist/service/user-service.service';
import { UtilService } from 'src/app/pharmacist/service/util.service';
import { setCurrentUser } from 'src/app/state/actions/users.action';

@Component({
  selector: 'app-inner-profile',
  templateUrl: './inner-profile.component.html',
  styleUrls: ['./inner-profile.component.css']
})
export class InnerProfileComponent{
  
  loadingFlag: boolean = true;
  innerProfileInformation!: User
  privacyLevel: number = 0;
  privacyLabel: string = 'เปิดเผยข้อมูลทั้งหมด'
  privacyLoadingFlag: boolean = false;
  
  constructor(private utilService: UtilService, private converter: JobTypeConverterService, private route: Router, private fb: FormBuilder, private userService: UserServiceService, private store: Store, private modalService: NgbModal){  
  }
  
  ngOnInit(){
    this.store.select((state: any)=>{
      return state.user
    }).subscribe((value: User)=>{
      this.innerProfileInformation = _.cloneDeep(value);
      if(this.innerProfileInformation.role !== ''){
        this.privacyLabel = this.innerProfileInformation.active!
        switch(this.innerProfileInformation.active){
          case 'เปิดเผยข้อมูลทั้งหมด':
            this.privacyLevel = 0
          break;
          case 'เปิดเผยข้อมูลบางส่วน':
            this.privacyLevel = 1
          break;
          case 'ไม่เปิดเผยข้อมูล':
            this.privacyLevel = 2
          break;
        }
        this.loadingFlag = false;
      }
    })
  }

  changePrivacy(privacyLevel: number, privacyLabel: string){
    this.privacyLevel = privacyLevel
    this.privacyLabel = privacyLabel
    this.privacyLoadingFlag = true;
    this.userService.updateUser({uid: this.innerProfileInformation.uid, active:this.privacyLabel}).then(()=>{
      this.privacyLoadingFlag = false;
      let payload: any = {
        active: privacyLabel
      }
      this.store.dispatch(setCurrentUser({user:payload}))
    })
  }
}


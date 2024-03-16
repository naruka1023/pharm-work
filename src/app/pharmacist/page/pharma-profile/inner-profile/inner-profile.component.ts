import { Component} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { LandingPageComponent } from 'src/app/pharmacist/landing-page.component';
import { User } from 'src/app/pharmacist/model/typescriptModel/users.model';
import { JobTypeConverterService } from 'src/app/pharmacist/service/job-type-converter.service';
import { UserServiceService } from 'src/app/pharmacist/service/user-service.service';
import { UtilService } from 'src/app/pharmacist/service/util.service';
import { setCurrentUser } from 'src/app/state/actions/users.action';
declare var window: any;

@Component({
  selector: 'app-inner-profile',
  templateUrl: './inner-profile.component.html',
  styleUrls: ['./inner-profile.component.css']
})
export class InnerProfileComponent{
  
  loadingFlag: boolean = true;
  searchModal!: any
  confirmViewProfile!: any
  innerProfileInformation!: User
  privacyLevel: number = 0;
  privacyLabel: string = 'อนุญาตให้ดูข้อมูล'
  tempLevel: number = 0;
  tempLabel: string = 'อนุญาตให้ดูข้อมูล'
  privacyLoadingFlag: boolean = false;
  
  
  constructor(private userService: UserServiceService, private store: Store, private landingPageComponent:LandingPageComponent){  
  }
  
  ngOnInit(){
    this.searchModal = new window.bootstrap.Modal(
      document.getElementById('searchModal')
      );
    this.confirmViewProfile = new window.bootstrap.Modal(
      document.getElementById('confirmViewProfile')
      );
    this.store.select((state: any)=>{
      return state.user
    }).subscribe((value: User)=>{
      this.innerProfileInformation = _.cloneDeep(value);
      if(this.innerProfileInformation.role !== ''){
        this.privacyLabel = this.innerProfileInformation.active!
        switch(this.innerProfileInformation.active){
          case 'อนุญาตให้ดูข้อมูล':
            this.privacyLevel = 0
          break;
          case 'จำกัดการดูข้อมูล':
            this.privacyLevel = 1
          break;
          case 'ไม่อนุญาติให้ดูข้อมูล':
            this.privacyLevel = 2
          break;
        }
        this.loadingFlag = false;
      }
    })
  }

  openModal(){
    this.searchModal.show()
  }

  openModalConfirmViewProfile(){
    this.confirmViewProfile.show()
  }

  resetTemp(){
    this.tempLabel = 'อนุญาตให้ดูข้อมูล'
    this.tempLevel = 0
  }
  cancel(){
    this.resetTemp
    this.confirmViewProfile.hide()
  }

  confirmChangePrivacy(){
    this.privacyLevel = this.tempLevel
    this.privacyLabel = this.tempLabel
    console.log('confirmchangeprivacy label', this.privacyLabel)
    this.resetTemp()
    this.confirmViewProfile.hide()
    let newJobPreferredType = this.innerProfileInformation.preferredJobType?.filter((jobType)=>{
      return jobType !== "งานด่วนรายวัน"
    })
    this.privacyLoadingFlag = true;
    this.userService.updateUser({uid: this.innerProfileInformation.uid, active:this.privacyLabel, preferredJobType: newJobPreferredType}).then(()=>{
      this.landingPageComponent.appendAlertfromOutside({
        body: '',
        title:'ประวัติของคุณ ถูกตั้งค่าการเปิดเผยข้อมูลเป็น ' + this.privacyLabel + ' เรียบร้อย',
        image: 'assets/accept.png',
        url: 'empty',
      })  
      this.privacyLoadingFlag = false;
      let payload: any = {
        preferredJobType: newJobPreferredType,
      }
      this.store.dispatch(setCurrentUser({user:payload}))
    })
  }
  
  changePrivacy(privacyLevel: number, privacyLabel: string){
    this.resetTemp()
    if(privacyLevel > 0){
      this.openModalConfirmViewProfile()
      this.tempLevel = privacyLevel
      this.tempLabel = privacyLabel
    }else{
      this.privacyLevel = privacyLevel
      this.privacyLabel = privacyLabel
      this.privacyLoadingFlag = true;
      this.userService.updateUser({uid: this.innerProfileInformation.uid, active:this.privacyLabel}).then(()=>{
        this.landingPageComponent.appendAlertfromOutside({
          body: '',
          title:'ประวัติของคุณ ถูกตั้งค่าการเปิดเผยข้อมูลเป็น ' + this.privacyLabel + ' เรียบร้อย',
          image: 'assets/accept.png',
          url: 'empty',
        }) 
        this.privacyLoadingFlag = false;
      })
    }
  }
}


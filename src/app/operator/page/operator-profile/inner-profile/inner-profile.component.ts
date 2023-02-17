import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from 'src/app/operator/model/user.model';
import { ProfileService } from 'src/app/operator/service/profile.service';
import { setCurrentUser } from 'src/app/state/actions/users.action';
declare var window: any;
@Component({
  selector: 'app-inner-profile',
  templateUrl: './inner-profile.component.html',
  styleUrls: ['./inner-profile.component.css']
})
export class InnerProfileComponent {

  loadingFlag: boolean = false;
  profileEditState!: boolean;
  innerProfileInformation!: User;
  profileEdit!:FormGroup;
  modal!:any;
  subject: Subscription = new Subscription();
  url: string = 'operator/profile-operator';
  
  constructor(private profileService:ProfileService, private store: Store, private fb: FormBuilder, private modalService: NgbModal, private route:Router){}

  ngOnInit(){
    this.profileEditState = false;
    this.modal = new window.bootstrap.Modal(
      document.getElementById('saveModal')
    );
    var modal = document.getElementById('saveModal');
    
    window.onclick = (event: { target: HTMLElement; }) =>{
      if (event.target == modal) {
        this.cancelEventClick()
      }
    }
    this.store.select((state: any)=>{
      return state.user
    }).subscribe((value: any)=>{
      this.innerProfileInformation = value;
      if(this.innerProfileInformation.role !== ''){
        this.initializeFormGroup();
        this.resetFormGroup();
        this.loadingFlag = false;
      }
    })
    this.subject.add(this.profileService.getLeaveEditSubject().subscribe((src)=>{
      this.url = src;
    }));
    this.subject.add(this.profileService.getEditSubject().subscribe((value: boolean)=>{
      if(this.profileEditState){
        this.openModal()
      }else{
        this.profileEditState = !this.profileEditState;
      }
    }))
  }

  cancelEventClick(){
    if(this.profileEditState){
      this.url = 'operator/profile-operator';
      this.profileService.sendRevertTabSubject();
      this.closeModal()
    }
  }

  initializeFormGroup(){
    this.profileEdit = this.fb.group({
      companyName: [''],
      jobType: [''],
      Location: this.fb.group({
        address: [''],
        Section: [''],
        District: [''],
        Province: [''],
      }),
      contacts: this.fb.group({
        phone: [''],
        email: [''],
        line: [''],
        facebook: [''],
      }),
      companyID: [''],
      nameOfPerson: [''],
      phoneNumber: [''],
    });
  }
  openModal(){
    this.modal.show();
  }  

  closeModal(){
    this.modal.hide();
  }
  
  resetFormGroup(){
    this.profileEdit.reset();
    this.profileEdit.patchValue(this.innerProfileInformation)
  }
  beginNavigation(){
    if(this.url.indexOf('?') === -1){
      this.route.navigate([this.url]);
    }else{
      const parsedUrl = this.url.split('?')[1].split('&');
      let queryParams: any = {
        queryParams:{}
      };
      parsedUrl.forEach((param)=>{
        const paramKeyValue = param.split('=');
        queryParams.queryParams[paramKeyValue[0]] = paramKeyValue[1];
      })
      this.url = '..'.concat(this.url.split('?')[0]);
      this.route.navigate([this.url], queryParams)
    }
  }
  discardClick(){
    this.profileEditState = false;
    this.resetFormGroup()
    this.beginNavigation()
    this.closeModal();
  }
  onSave(){
    this.loadingFlag = true
    const payload = {
      ...this.profileEdit.value,
      uid: this.innerProfileInformation.uid,
      role: this.innerProfileInformation.role,
      email: this.innerProfileInformation.email
    }
    this.profileService.updateUser(payload).then(()=>{
      this.store.dispatch(setCurrentUser({user: payload}))
      this.beginNavigation()
      this.loadingFlag = false;
      this.profileEditState = false;
      this.closeModal();
    })
  }
  ngOnDestroy(){
    this.subject.unsubscribe();
  }
}

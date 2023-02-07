import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from 'src/app/operator/model/user.model';
import { ProfileService } from 'src/app/operator/service/profile.service';
import { setCurrentUser } from 'src/app/state/actions/users.action';

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
  @ViewChild('myModal') modal!:TemplateRef<any>;
  subject: Subscription = new Subscription();
  url: string = 'profile-operator';
  
  constructor(private profileService:ProfileService, private store: Store, private fb: FormBuilder, private modalService: NgbModal, private route:Router){}

  ngOnInit(){
    this.profileEditState = false;
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
        let modal = this.modalService.open(this.modal);
      }else{
        this.profileEditState = !this.profileEditState;
      }
    }))
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
    let modalActive = this.modalService.open(this.modal);
    modalActive.hidden.subscribe(()=>{
      if(this.profileEditState){
        this.url = 'profile-pharma';
        this.profileService.sendRevertTabSubject();
      }
    })
  }  
  
  resetFormGroup(){
    this.profileEdit.reset();
    this.profileEdit.patchValue(this.innerProfileInformation)
  }
  beginNavigation(){
    if(this.url.indexOf('profile-operator') === -1){
      if(this.url === '/operator'){
        this.route.navigate(['operator'])
      }
    }else{
      this.route.navigate([this.url])
    }
  }
  discardClick(){
    this.profileEditState = false;
    this.resetFormGroup()
    this.beginNavigation()
    this.modalService.dismissAll()
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
      this.modalService.dismissAll()
    })
  }
  ngOnDestroy(){
    this.subject.unsubscribe();
  }
}

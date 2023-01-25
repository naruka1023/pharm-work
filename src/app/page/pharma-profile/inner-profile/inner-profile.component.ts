import { Component, TemplateRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
  
  subject: Subscription = new Subscription();
  innerProfileInformation!: User
  loadingFlag: boolean = true;
  numbersEducation: number[] = [1];
  localProfileFlag: boolean = true;
  profileEdit!:FormGroup;
  url: string = 'profile-pharma';
  numbersOccupation: number[] = [1];
  @ViewChild('myModal') modal!:TemplateRef<any>;
  constructor(private route: Router,private fb: FormBuilder, private userService: UserServiceService, private store: Store, private modalService: NgbModal){

  }
  
  ngOnInit(){
    this.localProfileFlag = true;
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
    this.subject.add(this.userService.getLeaveEditSubject().subscribe((src)=>{
      this.url = src;
    }));
    this.subject.add(this.userService.getEditSubject().subscribe((value: boolean)=>{
      if(!this.localProfileFlag){
        let modal = this.modalService.open(this.modal);
      }else{
        this.localProfileFlag = !this.localProfileFlag;
      }
    }))
  }
  openModal(){
    let modalActive = this.modalService.open(this.modal);
    modalActive.hidden.subscribe(()=>{
      if(!this.localProfileFlag){
        this.url = 'profile-pharma';
        this.userService.sendRevertTabSubject();
      }
    })
  }
  onSave(){
    console.log(this.profileEdit.value);
  }
  addEducation(){
    this.numbersEducation.push(1)
  }
  ngOnDestroy(){
    this.subject.unsubscribe();
  }
  removeEducation(index: number){
    this.numbersEducation.splice(index, 1);
  }
  addOccupation(){
    this.numbersOccupation.push(1)
  }
  removeOccupation(index: number){
    this.numbersOccupation.splice(index, 1);
  }
  initializeFormGroup(){
    this.profileEdit = this.fb.group({
      name: [''],
      surname: [''],
      gender: [''],
      birthDate: [''],
      location: this.fb.group({
        address: [''],
        section: [''],
        district: [''],
        province: [''],
      }),
      educationLevel: [''],
      contacts: this.fb.group({
        phone: [''],
        email: [''],
        line: [''],
        facebook: [''],
      }),
      license: [''],
    });
  }
  resetFormGroup(){
    this.profileEdit.reset();
    this.profileEdit.setValue({
      name: this.innerProfileInformation.name,
      surname: this.innerProfileInformation.surname,
      gender: this.innerProfileInformation.gender || '',
      birthDate: this.innerProfileInformation.birthday || '',
      location: {
        address: this.innerProfileInformation.Location.address || '',
        section: this.innerProfileInformation.Location.Section || '',
        district: this.innerProfileInformation.Location.District || '',
        province: this.innerProfileInformation.Location.Province || '',
      },
      educationLevel: this.innerProfileInformation.educationLevel || '',
      contacts: {
        phone: this.innerProfileInformation.contacts?.phone || '',
        email: this.innerProfileInformation.contacts?.email || '',
        line: this.innerProfileInformation.contacts?.line || '',
        facebook: this.innerProfileInformation.contacts?.facebook || ''
      },
      license: this.innerProfileInformation.license || '',
    })
  }
  discardClick(){
    this.localProfileFlag = true;
    this.resetFormGroup()
    if(this.url.indexOf('profile-pharma') === -1){
      const parsedUrl = this.url.split('?')[1].split('&');
      let queryParams: any = {
        queryParams:{}
      };
      parsedUrl.forEach((param)=>{
        const paramKeyValue = param.split('=');
        queryParams.queryParams[paramKeyValue[0]] = paramKeyValue[1];
      })
      console.log(queryParams);
      this.url = '..'.concat(this.url.split('?')[0]);
      this.route.navigate([this.url], queryParams)
    }else{
      this.route.navigate([this.url])
    }
    this.modalService.dismissAll()
  }
}

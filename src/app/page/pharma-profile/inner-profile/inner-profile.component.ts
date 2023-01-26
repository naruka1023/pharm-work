import { Component, TemplateRef, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
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
    let control = this.profileEdit.get('jobHistory') as FormArray;
    let controlGroup = control.controls as FormGroup[];
    controlGroup.forEach((group)=>{
      group.get('activeFlag')?.setValue('');
    })

    console.log(this.profileEdit.value);
  }
  ngOnDestroy(){
    this.subject.unsubscribe();
  }
  addEducation(){
    let educationToAdd = this.fb.group({
      universityName: [''],
      franchise: [''],
      yearGraduated: [''],
    });
    let newValue: FormArray = this.profileEdit.controls['educationHistory'] as FormArray;
    newValue.push(educationToAdd);
    this.profileEdit.controls['educationHistory'].setValue(newValue.value);
  }
  removeEducation(index: number){
    if(index > 0){
      let newValue: FormArray = this.profileEdit.controls['educationHistory'] as FormArray;
      newValue.removeAt(index);
      this.profileEdit.controls['educationHistory'].setValue(newValue.value);
    }
  }

  addOccupation(){
    let jobToAdd = this.fb.group({
      jobName: [''],
      activeFlag: [''],
      companyName: [''],
      description: [''],
      dateStarted: [''],
      dateEnded: [''],
    });
    let newValue: FormArray = this.profileEdit.controls['jobHistory'] as FormArray;
    newValue.push(jobToAdd)
  }
  removeOccupation(index: number){
    if(index > 0){
      let newValue: FormArray = this.profileEdit.controls['jobHistory'] as FormArray;
      newValue.removeAt(index);
      let control: FormArray = this.profileEdit.get('jobHistory') as FormArray
      let controlGroup = control.controls as FormGroup[]
        controlGroup.forEach((group: FormGroup)=>{
        group.get('activeFlag')?.setValue(false);
      })
      this.profileEdit.get('active')?.setValue('')
    }
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
      active: ['true'],
      educationHistory: this.fb.array([
        this.fb.group({
          universityName: [''],
          franchise: [''],
          yearGraduated: [''],
        })
      ]),
      jobHistory: this.fb.array([
        this.fb.group({
          jobName: [''],
          companyName: [''],
          description: [''],
          dateStarted: [''],
          dateEnded: [''],
          activeFlag: [''],
        })
      ]),
    });
  }
  get FormEduData(){
    let entity = this.profileEdit.get('educationHistory') as FormArray;
    return entity.controls;
  }

  get FormJobData(){
    let entity = this.profileEdit.get('jobHistory') as FormArray;
    return entity.controls;
  }
  changeDetected(e: any, index: number){
    this.profileEdit.get('active')?.setValue('active'+ index)
  }
  resetFormGroup(){
    this.profileEdit.reset();
    this.profileEdit.patchValue({
      name: this.innerProfileInformation.name || '',
      surname: this.innerProfileInformation.surname || '',
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
      active:this.innerProfileInformation.active || '',
      educationHistory: this.innerProfileInformation.educationHistory ||    
      [{
        universityName:'',
        franchise:'',
        yearGraduated:'',
      }],
      jobHistory: this.innerProfileInformation.jobHistory ||  
      [{
        jobName:'',
        companyName:'',
        dateStarted:'',
        dateEnded:'',
        description:'',
        activeFlag: '',
      }]
    })
  }
  discardClick(){
    this.localProfileFlag = true;
    this.resetFormGroup()
    if(this.url.indexOf('profile-pharma') === -1){
      if(this.url == '' || this.url == '/'){
        this.route.navigate(['']);
      }else{
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
      }
    }else{
      this.route.navigate([this.url])
    }
    this.modalService.dismissAll()
  }
}


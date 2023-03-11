import { Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { JobHistory, User } from 'src/app/pharmacist/model/typescriptModel/users.model';
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
export class InnerProfileComponent implements OnDestroy{
  
  subject: Subscription = new Subscription();
  innerProfileInformation!: User
  loadingFlag: boolean = true;
  showSwitch!: boolean;
  showSwitchLoadingFlag:boolean = false;
  numbersEducation: number[] = [1];
  localProfileFlag: boolean = true;
  resultPayload?: string[];
  profileEdit!:FormGroup;
  url: string = 'pharma/profile-pharma';
  numbersOccupation: number[] = [1];
  modal!:any;
  constructor(private utilService: UtilService, private converter: JobTypeConverterService, private route: Router, private fb: FormBuilder, private userService: UserServiceService, private store: Store, private modalService: NgbModal){  
  }
  
  ngOnInit(){
    this.localProfileFlag = true;
    this.modal = new window.bootstrap.Modal(
      document.getElementById('saveModal')
    );
    var modal = document.getElementById('saveModal');
    
    window.onclick = (event: { target: HTMLElement }) =>{
      if (event.target == modal) {
        this.cancelEventClick()
      }
    }
    this.store.select((state: any)=>{
      return state.user
    }).subscribe((value: User)=>{
      this.innerProfileInformation = _.cloneDeep(value);
      if(this.innerProfileInformation.role !== ''){
        this.innerProfileInformation = this.utilService.populateLocationFieldsWithObject(this.innerProfileInformation);
        this.resultPayload = this.innerProfileInformation.preferredJobType;
        this.showSwitch = value.showProfileFlag;
        this.resetFormGroup();
        this.loadingFlag = false;
      }
    })
    this.subject.add(this.userService.getLeaveEditSubject().subscribe((src)=>{
      this.url = src;
    }));
    this.subject.add(this.userService.getEditSubject().subscribe((value: boolean)=>{
      if(!this.localProfileFlag){
        this.openModal()
      }else{
        this.localProfileFlag = !this.localProfileFlag;
      }
    }))
  }
  openModal(){
    this.modal.show();
  }  

  switchShowProfile(events:any){
    this.showSwitchLoadingFlag = true;
    this.userService.updateUser({
      ...this.innerProfileInformation,
      showProfileFlag:this.showSwitch
    }).then(()=>{
      this.showSwitchLoadingFlag = false;
    })
  }

  closeModal(){
    this.modal.hide();
  }
  cancelEventClick() {
      this.url = 'pharma/profile-pharma';
      this.userService.sendRevertTabSubject();
      this.closeModal()
  }

  onSave(){
    let control = this.profileEdit.get('jobHistory') as FormArray;
    let controlGroup = control.controls as FormGroup[];
    controlGroup.forEach((group)=>{
      group.get('activeFlag')?.setValue('');
    })
    this.loadingFlag = true
    let payload = {
      ...this.profileEdit.value,
      uid: this.innerProfileInformation.uid,
      role: this.innerProfileInformation.role,
      email: this.innerProfileInformation.email,
      preferredJobType: this.converter.objectToArray(this.profileEdit.value.preferredJobType),
      AmountCompleted: this.innerProfileInformation.AmountCompleted
    }
    payload = this.utilService.populateObjectWithLocationFields(payload);
    this.userService.updateUser(payload).then(()=>{
      this.store.dispatch(setCurrentUser({user: payload}))
      this.loadingFlag = false;
      this.localProfileFlag = true;
    })
    this.beginNavigation();
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
      birthday: [''],
      Location: this.fb.group({
        address: [''],
        Section: [''],
        District: [''],
        Province: [''],
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
      preferredJobType: this.fb.group({
        S: [false],
        AA: [false],
        AB: [false],
        AC: [false],
        BA: [false],
        BB: [false],
        BC: [false],
        CA: [false],
        CB: [false],
      }),
      WorkExperience: [''],
      showProfileFlag: true,
      preferredTimeFrame: [''],
      preferredLocation: this.fb.group({
        Section: [''],
        District: [''],
        Province: [''], 
      }),
      preferredStartTime: [''],
      preferredSalary: [''],
    });
  }

  dateStarted(index:number){
    let value = this.profileEdit.get('jobHistory')?.value[index].dateStarted
    return  value as number
  }

  dateEnded(index:number){
    let value = this.profileEdit.get('jobHistory')?.value[index].dateEnded
    return  value as number
  }

  get WorkExperience(){
    let value = this.profileEdit.get('WorkExperience')?.value
    return  value as number
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
  calculateDateDiff(startDate:string, endDate:string){
    const date1 = new Date(startDate).valueOf();
    const date2 = new Date(endDate).valueOf();
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays
  }
  resetFormGroup(){
    this.initializeFormGroup();
    let resultObject = this.converter.arrayToObject(this.innerProfileInformation.preferredJobType)
    this.profileEdit.patchValue({
      ...this.innerProfileInformation,
      preferredJobType:resultObject
    })
    this.profileEdit.get('jobHistory')?.valueChanges.subscribe((profile)=>{
      let workExperience = 0
      profile.forEach((pr:JobHistory)=>{
        if(pr.dateStarted !== '' && pr.dateEnded !== ''){
          workExperience += this.calculateDateDiff(pr.dateStarted, pr.dateEnded)
        }
      })
      workExperience = Math.floor(workExperience/365)
      this.profileEdit.patchValue({WorkExperience:workExperience})
    })
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
    this.localProfileFlag = true;
    this.resetFormGroup();
    this.beginNavigation();
    this.closeModal();
  }
}


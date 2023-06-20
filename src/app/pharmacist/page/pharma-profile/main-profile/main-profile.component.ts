import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { JobHistory, User } from 'src/app/pharmacist/model/typescriptModel/users.model';
import { UserServiceService } from 'src/app/pharmacist/service/user-service.service';
import { UtilService } from 'src/app/pharmacist/service/util.service';
import { setCurrentUser } from 'src/app/state/actions/users.action';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-main-profile',
  templateUrl: './main-profile.component.html',
  styleUrls: ['./main-profile.component.css']
})
export class MainProfileComponent {
  innerProfileInformation!: User;
  editFlag:boolean = false
  loadingFlag: boolean = false
  profileEdit!:FormGroup
  descriptionEditor = ClassicEditor;
  descriptionModel = {
    editorData: ''
  };
  constructor(private store: Store, private userService: UserServiceService, private fb: FormBuilder,private utilService:UtilService){

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

  changeDetected(e: any, index: number){
    this.profileEdit.get('active')?.setValue('active'+ index)
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

  addEducation(){
    let educationToAdd = this.fb.group({
      universityName: [''],
      franchise: [''],
      yearGraduated: [''],
      educationLevel: [''],
      major: ['']
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
      activeFlag: false,
      companyName: [''],
      description: [''],
      dateStarted: [''],
      workExperience: 0,
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
      educationHistory: this.fb.array([]),
      jobHistory: this.fb.array([]),
      highestEducation: [''],
      WorkExperience: [''],
    });
  }
  getCurrentDate(){
    let parsedDate = new Date()
    let months = (parsedDate.getFullYear()) * 12
    months += parsedDate.getMonth();
    return Math.floor(months/12)
  }
  calculateDateDiff(startDate:string, endDate:string){
    let months;
    let parsedStart = new Date(startDate);
    let parsedEnd = new Date(endDate);
    months = (parsedEnd.getFullYear() - parsedStart.getFullYear()) * 12;
    months -= parsedStart.getMonth();
    months += parsedEnd.getMonth();
    let ans = months <= 0 ? 0 : months
    return ans;
  }
  resetFormGroup(){
    this.initializeFormGroup();
    if(this.innerProfileInformation.educationHistory == undefined){
      this.addEducation()
    }
    if(this.innerProfileInformation.jobHistory == undefined){
      this.addOccupation()
    }
    this.innerProfileInformation.educationHistory?.forEach((edh)=>{
      this.addEducation()
    })

    this.innerProfileInformation.jobHistory?.forEach((edh)=>{
        this.addOccupation()
    })
  
    
    this.profileEdit.patchValue({
      ...this.innerProfileInformation,
    })
    this.profileEdit.get('jobHistory')?.valueChanges.subscribe((profile)=>{
      profile.forEach((pr:JobHistory)=>{
        if(pr.activeFlag){
          let date : any = new Date()
          pr.dateEnded = date
        }
        if(pr.dateStarted !== '' && pr.dateEnded !== ''){
          let dateDiff = this.calculateDateDiff(pr.dateStarted, pr.dateEnded)
          let years = Math.floor(dateDiff/12) > 0? Math.floor(dateDiff/12) + ' ปี': '';
          let months = dateDiff % 12 > 0? + dateDiff % 12 + ' เดือน': '';
          pr.workExperience =  years + " " + months
        }
      })
      this.profileEdit.patchValue(profile)
    })
  }
  onSave(){
    let payload = {
      ...this.profileEdit.value,
      uid: this.innerProfileInformation.uid,
      dateUpdated: new Date().toISOString().split('T')[0],
    }
    let totalMonths: number = 0 
    let totalYear : number = 0
    let jobHistoryList: JobHistory[] =this.profileEdit.get('jobHistory')?.value
    jobHistoryList.forEach((jobHistory)=>{
      let workExp = jobHistory.workExperience.split(' ')
      if(workExp.length >2){
        totalMonths += Number(workExp[2])
      }
      totalYear += Number(workExp[0])
    })
    totalYear += Math.floor(totalMonths/12)
    payload = {
      ...payload,
      WorkExperience: totalYear
    }
    this.loadingFlag = true
    this.userService.updateUser(payload).then(()=>{
      this.loadingFlag = false
      this.store.dispatch(setCurrentUser({user: payload}))
      this.editClick()
    })
  }
}

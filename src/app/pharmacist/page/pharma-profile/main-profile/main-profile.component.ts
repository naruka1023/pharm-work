import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { JobHistory, User } from 'src/app/pharmacist/model/typescriptModel/users.model';
import { UserServiceService } from 'src/app/pharmacist/service/user-service.service';
import { UtilService } from 'src/app/pharmacist/service/util.service';
import { setCurrentUser } from 'src/app/state/actions/users.action';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Validation from 'src/app/utils/validation';

@Component({
  selector: 'app-main-profile',
  templateUrl: './main-profile.component.html',
  styleUrls: ['./main-profile.component.css']
})
export class MainProfileComponent {
  innerProfileInformation!: User;
  editFlag:boolean = false
  loadingFlag: boolean = false
  submitted: boolean = false
  profileEdit!:any
  descriptionEditor = ClassicEditor;
  descriptionModel = {
    editorData: ''
  };
  constructor(private store: Store, private userService: UserServiceService, private fb: FormBuilder,private utilService:UtilService){}

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
    }else{
    }
  }

  changeDetected(e: any, index: number){
    let control: FormArray = this.profileEdit.get('jobHistory') as FormArray
    let controlGroup = control.controls as FormGroup[]
      controlGroup.forEach((group: FormGroup, innerIndex)=>{
      if(innerIndex != index){
        group.get('activeFlag')?.setValue(false);
      }
    })
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

  get FormEduData(): any{
    let entity = this.profileEdit.get('educationHistory') as FormArray;
    return entity.controls;
  }

  get FormJobData(): any{
    let entity = this.profileEdit.get('jobHistory') as FormArray;
    return entity.controls;
  }
  
  get profileEditControls(): { [key: string]: AbstractControl } {
    return this.profileEdit.controls;
  }

  addEducation(){
    let educationToAdd = this.fb.group({
      universityName: ['', [Validators.required]],
      franchise: [''],
      yearGraduated: ['', [Validators.required]],
      educationLevel: ['', [Validators.required]],
      major: ['', [Validators.required]]
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
      jobName: ['', [Validators.required]],
      activeFlag: false,
      companyName: ['', [Validators.required]],
      description: [''],
      dateStarted: ['', [Validators.required]],
      workExperience: 0,
      dateEnded: ['', [Validators.required]],
    });
    let newValue: FormArray = this.profileEdit.controls['jobHistory'] as FormArray;
    newValue.push(jobToAdd)
  }

  removeOccupation(index: number){
    if(index > 0){
      let newValue: FormArray = this.profileEdit.controls['jobHistory'] as FormArray;
      newValue.removeAt(index);
      this.profileEdit.get('active')?.setValue('')
    }
  }

  initializeFormGroup(){
    this.profileEdit = this.fb.group({
      educationHistory: this.fb.array([]),
      jobHistory: this.fb.array([]),
      highestEducation: ['', [Validators.required]],
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
    this.submitted = false
    let jobHistory: JobHistory[] = []
    this.initializeFormGroup();
    if(this.innerProfileInformation.educationHistory == undefined){
      this.addEducation()
    }
    if(this.innerProfileInformation.jobHistory == undefined){
      this.addOccupation()
    }else{
      jobHistory = this.innerProfileInformation.jobHistory?.map((job: JobHistory)=>{
        return {
          ...job,
          dateStarted: job.dateStarted.replace('/', '-'),
          dateEnded: job.dateEnded.replace('/', '-')
        }
      })
    }
    this.innerProfileInformation.educationHistory?.forEach((edh)=>{
      this.addEducation()
    })

    this.innerProfileInformation.jobHistory?.forEach((edh)=>{
        this.addOccupation()
    })
  
    this.profileEdit.patchValue({
      ...this.innerProfileInformation,
      jobHistory : jobHistory
    })
    this.profileEdit.get('jobHistory')?.valueChanges.subscribe((profile: any)=>{
      profile.forEach((pr:JobHistory)=>{
        if(pr.activeFlag){
          let date : any = new Date().toISOString().split('T')[0].split('-')
          pr.dateEnded = date[0] + '-' + date[1]
        }
        if(pr.dateStarted !== '' && pr.dateEnded !== ''){
          let dateDiff = this.calculateDateDiff(pr.dateStarted, pr.dateEnded)
          let years = Math.floor(dateDiff/12) > 0? Math.floor(dateDiff/12) + ' ปี': '';
          let months = dateDiff % 12 > 0? + dateDiff % 12 + ' เดือน': '';
          pr.workExperience =  years + " " + months
        }
        pr.dateStarted = pr.dateStarted.replace('-', '/') 
        pr.dateEnded = pr.dateEnded.replace('-', '/')
      })
      this.profileEdit.patchValue(profile)
    })
  }

  onSave(){
    this.submitted = true
    if (this.profileEdit.invalid) {
      return;
    }
    let payload: any = {
      ...this.profileEdit.value,
      uid: this.innerProfileInformation.uid,
      dateUpdated: new Date().toISOString().split('T')[0],
    }
    let totalMonths: number = 0 
    let totalYear : number = 0
    let jobHistoryList: JobHistory[] =this.profileEdit.get('jobHistory')?.value
    jobHistoryList.forEach((jobHistory, index)=>{
      let workExp = jobHistory.workExperience.trim().split(' ')
      if(workExp.length > 2){
        totalMonths += Number(workExp[2])
        totalYear += Number(workExp[0])
      }else{
        totalMonths += Number(workExp[0])
      }
    })
    totalYear += Math.floor(totalMonths/12)
    payload = {
      ...payload,
      jobHistory: jobHistoryList,
      WorkExperience: totalYear == 0? totalMonths: totalYear,
      yearFlag: totalYear !== 0, 
      dateUpdatedUnix: Math.floor(new Date().getTime() / 1000), 
      dateUpdated: new Date().toISOString().split('T')[0]
    }
    this.loadingFlag = true
    this.userService.updateUser(payload).then(()=>{
      this.loadingFlag = false
      this.store.dispatch(setCurrentUser({user: payload}))
      this.editClick()
    })
  }
}

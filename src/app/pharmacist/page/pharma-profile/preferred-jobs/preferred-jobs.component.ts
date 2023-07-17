import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ValidatorFn, AbstractControl, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { User } from 'src/app/pharmacist/model/typescriptModel/users.model';
import { JobTypeConverterService } from 'src/app/pharmacist/service/job-type-converter.service';
import { UserServiceService } from 'src/app/pharmacist/service/user-service.service';
import { UtilService } from 'src/app/pharmacist/service/util.service';
import { setCurrentUser } from 'src/app/state/actions/users.action';
import { atLeastOneCheckboxCheckedValidator } from './require-checkboxes-to-be-checked.validator';

@Component({
  selector: 'app-preferred-jobs',
  templateUrl: './preferred-jobs.component.html',
  styleUrls: ['./preferred-jobs.component.css']
})
export class PreferredJobsComponent {
  innerProfileInformation!: User;
  resultPayload:string[] = []
  editFlag:boolean = false
  submitted: boolean = false;
  loadingFlag: boolean = false
  profileEdit!:FormGroup
  constructor(private store: Store,  private converter: JobTypeConverterService, private userService: UserServiceService, private fb: FormBuilder, private utilService:UtilService){}

  ngOnInit(){
    this.store.select((state: any)=>{
      return state.user
    }).subscribe((value: User)=>{
      
      this.innerProfileInformation = _.cloneDeep(value);
      if(this.innerProfileInformation.role !== ''){
        this.innerProfileInformation = this.utilService.populateLocationFieldsWithObject(this.innerProfileInformation);
        this.resultPayload = this.innerProfileInformation.preferredJobType!;
        this.resetFormGroup();
      }
    })
  }

  get getNewJobForm(): { [key: string]: AbstractControl } { 
    return this.profileEdit.controls;
  }
  
  initializeFormGroup(){
    this.profileEdit = this.fb.group({
      preferredJobType: new FormGroup({
        S: new FormControl(false),
        AA: new FormControl(false),
        AB: new FormControl(false),
        AC: new FormControl(false),
        BA: new FormControl(false),
        BB: new FormControl(false),
        BC: new FormControl(false),
        CA: new FormControl(false),
        CB: new FormControl(false),
      }, atLeastOneCheckboxCheckedValidator()),
      showProfileFlag: true,
      preferredTimeFrame: [[''], Validators.required],
      preferredLocation: this.fb.group({
        Section: [''],
        District: [''],
        Province: [''], 
      }),
      preferredStartTime: [''],
      preferredSalary: [''],
    });
  }
  resetFormGroup(){
    this.initializeFormGroup();
    this.profileEdit.patchValue({
      ...this.innerProfileInformation,
    })
    let resultObject = this.converter.arrayToObject(this.innerProfileInformation.preferredJobType)
    this.profileEdit.patchValue({
      ...this.innerProfileInformation,
      preferredJobType:resultObject
    })
  }
  onSave(){
    this.submitted = true
    if(this.profileEdit.invalid){
      return
    }
    let payload = {
      ...this.profileEdit.value,
      uid: this.innerProfileInformation.uid,
      preferredJobType: this.converter.objectToArray(this.profileEdit.value.preferredJobType),
      dateUpdated: new Date().toISOString().split('T')[0]
    }
    payload = this.utilService.populateObjectWithLocationFields(payload);
    this.loadingFlag = true
    this.userService.updateUser(payload).then(()=>{
      this.loadingFlag = false
      this.store.dispatch(setCurrentUser({user: payload}))
      this.editClick()
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
}

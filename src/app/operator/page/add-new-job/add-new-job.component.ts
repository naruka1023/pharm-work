import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Contacts, User } from '../../model/user.model';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Instance } from 'flatpickr/dist/types/instance';
import { JobService } from '../../service/job.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { jobPostModel } from '../../model/jobPost.model';
import { toggleAddressChange } from '../../state/actions/address.actions';

@Component({
  selector: 'app-add-new-job',
  templateUrl: './add-new-job.component.html',
  styleUrls: ['./add-new-job.component.css']
})
export class AddNewJobComponent {
  constructor(private store: Store, private fb: FormBuilder,private newJobService : JobService, private route: ActivatedRoute){}

  user$!: Observable<User>;
  userState!: User
  timeFrame!:string  
  newJobForm!: FormGroup;
  urgency!: any;
  sub!: Promise<any>;
  province$!: Observable<string[]>;
  district$!: Observable<string[]>;
  section$!: Observable<string[]>;
  nearBTSFlag: boolean = false
  nearARLFlag: boolean = false
  nearMRTFlag: boolean = false
  nearSRTFlag: boolean = false
  phone$!:Observable<string>;
  email$!:Observable<string>;
  line$!:Observable<string>;
  facebook$!:Observable<string>;
  timeStart: string = '';
  timeEnd: string = '';
  salaryStart: string = '';
  salaryEnd: string = '';
  flag!: Instance[] | Instance;
  arlStations$!: Observable<string[]>;
  srtStations$!: Observable<string[]>;
  btsStations$!: Observable<string[]>;
  mrtStations$!: Observable<string[]>;
  jobDetailsEditor = ClassicEditor;
  jobDetailsModel = {
    editorData: ''
  };
  travelEditor = ClassicEditor;
  travelModel = {
    editorData: ''
  };
  jobBenefitsEditor = ClassicEditor;
  jobBenefitsModel = {
    editorData: ''
  };
  applyInstructionsEditor = ClassicEditor;
  applyInstructionsModel = {
    editorData: ''
  };
  qualityEditor = ClassicEditor;
  qualityModel = {
    editorData: ''
  };

  ngOnInit(){ 
    this.urgency = this.route.snapshot.queryParamMap.get('urgency')!;
    
    this.urgency = (this.urgency == 'false')?false: true;
    
    this.phone$ = this.store.select((state: any) =>{
      return state.user.contacts.phone
    })
    this.line$ = this.store.select((state: any) =>{
      return state.user.contacts.line
    })
    this.email$ = this.store.select((state: any) =>{
      return state.user.contacts.email
    })
    this.facebook$ = this.store.select((state: any) =>{
      return state.user.contacts.facebook
    })
    this.srtStations$ = this.store.select((state: any)=>{
      return state.address.srt
    })
    this.arlStations$ = this.store.select((state: any)=>{
      return state.address.arl
    })
    this.btsStations$ = this.store.select((state: any)=>{
      return state.address.bts
    })
    this.mrtStations$ = this.store.select((state: any)=>{
      return state.address.mrt
    })
    this.province$ = this.store.select((state: any)=>{
      let result = Object.keys(state.address.list);
      return result
    })
    this.district$ = this.store.select((state: any)=>{
      if(this.newJobForm.value.Location.Province === ''){
        return [];
      }
      return Object.keys(state.address.list[this.newJobForm.value.Location.Province])
    })
    this.section$ = this.store.select((state: any)=>{
      if(this.newJobForm.value.Location.District === ''){
        return [];
      }
      let section: string[] = state.address.list[this.newJobForm.value.Location.Province][this.newJobForm.value.Location.District].map((section: any)=>section.section);
      return section
    })
    this.user$ = this.store.select((state: any)=>{
      return state.user
    })
    this.user$.subscribe((user: User)=>{
      this.userState = user;
    })
    this.initializeFormGroup();

    this.newJobForm.valueChanges.subscribe((form) =>{
      if(!this.urgency){
        this.timeFrame = form.TimeFrame
      }
    })
    this.scrollUp();
  }
  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }
  handleCalendarChange(value: any){
    this.newJobForm.patchValue({
      DateOfJob: value.selectedDates
    })
  }
  mapJobTypeToCategorySymbol(){
    let categorySymbol = ''
    if(this.urgency){
      categorySymbol = 'AA';
    }else{
      switch(this.userState.jobType){
        case 'ร้านยาทั่วไป':
          categorySymbol = 'AB';
          break;
        case 'ร้านยาแบรนด์':
          categorySymbol = 'AC';
          break;
        case 'โรงพยาบาล':
          categorySymbol = 'BB';
          break;
        case 'โรงงาน':
          categorySymbol = 'BC';
          break;
        case 'บริษัทยา':
          categorySymbol = 'BC';
          break;
        case 'มหาวิทยาลัย':
          categorySymbol = 'CA';
          break;
        case 'อื่นๆ':
          categorySymbol = 'CA';
          break;
      }
    }
    return categorySymbol
  }


  initializeFormGroup(){
    this.newJobForm = this.fb.group({
      JobType: this.userState.jobType,
      Establishment: this.userState.companyName,
      CategorySymbol: this.mapJobTypeToCategorySymbol(),
      dateCreated: [''],
      dateUpdated: [''],
      TimeFrame: [''],
      OperatorUID: [this.userState.uid],
      JobName: [''],
      Amount: [''],
      DateOfJob: [''],
      Active: [false],
      Duration: [''],
      Urgency: [this.urgency],
      Salary: this.fb.group({
        Amount:[''],
        Suffix: [''],
      }),
      OnlineInterview: [false],
      WorkFromHome: [false],
      Location: this.fb.group({
        Section: [''],
        District: [''],
        Province: [''],
      }),
      Contacts: this.fb.group({
        phone: this.userState.contacts?.phone,
        email: this.userState.contacts?.email,
        line: this.userState.contacts?.line,
        facebook: this.userState.contacts?.facebook
      }),
      MRT: this.fb.group({
        Near: [''],
        Station: ['']
      }),
      BTS: this.fb.group({
        Near: [''],
        Station: ['']
      }),
      SRT: this.fb.group({
        Near: [''],
        Station: ['']
      }),
      ARL: this.fb.group({
        Near: [''],
        Station: ['']
      }),
      JobDetails: [''],
      TravelInstructions: [''],
    });
    if(this.userState.jobType === 'ร้านยาแบรนด์'){
      this.newJobForm.addControl('Franchise', this.fb.control(['']));
    }
    if(this.urgency){
      this.timeFrame = "Part-Time"
      this.newJobForm.patchValue({
        TimeFrame: "Part-Time"
      })
    }else{
      this.newJobForm.addControl('qualityApplicants', this.fb.control('')); 
      this.newJobForm.addControl('jobBenefits', this.fb.control('')); 
      this.newJobForm.addControl('applyInstructions', this.fb.control('')); 
    }
  }
  
  provinceSelected(){
    this.newJobForm.patchValue({
      Location:{
        ...this.newJobForm.value.Location,
        District:'',
        Section:''
      }
    })
    this.store.dispatch(toggleAddressChange())
  }
  districtSelected(){
    this.newJobForm.patchValue({
      Location:{
        ...this.newJobForm.value.Location,
        Section:''
      }
    })
    this.store.dispatch(toggleAddressChange())
  }
  sectionSelected(){
    this.store.dispatch(toggleAddressChange())
  }
  onSave(){
    let processedInfo = {};
    if(this.salaryStart !== '' && this.salaryEnd !== ''){
      processedInfo = 
      {
        Salary: {
          Amount: this.salaryStart + ' - ' + this.salaryEnd
        }
      }
    }
    if(this.timeStart !== '' && this.timeEnd !== ''){
      processedInfo = 
      {
        ...processedInfo,
        Duration: this.timeStart + ' - ' + this.timeEnd
      }
    }
    processedInfo = {
      ...processedInfo, 
      Urgency: this.urgency,
      MRT:{
        Near: this.nearMRTFlag
      },
      BTS:{
        Near: this.nearBTSFlag
      },
      SRT:{
        Near: this.nearSRTFlag
      },
      ARL:{
        Near: this.nearARLFlag
      },
      dateCreated: new Date().toISOString().split('T')[0],
      dateUpdated: new Date().toISOString().split('T')[0],
    }
    this.newJobForm.patchValue(processedInfo)
    
    if(this.urgency){
      if(this.newJobForm.value.DateOfJob.length > 1){
        this.sub = this.newJobService.addMultipleJobs(this.newJobForm.value)
      }else{
        if(this.newJobForm.value.DateOfJob.length !== 0){
          let processedDate = this.newJobForm.value.DateOfJob[0].toISOString().split('T')[0]
          this.newJobForm.patchValue({
            DateOfJob:processedDate
          })
        }
        this.sub = this.newJobService.addOneJob(this.newJobForm.value)
      }
    }else{
      this.sub = this.newJobService.addOneJob(this.newJobForm.value)
    }
    this.sub.then((job)=>{
    })
  }
}

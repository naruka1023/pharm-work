import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Contacts, User } from '../../model/user.model';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Instance } from 'flatpickr/dist/types/instance';
import { JobService } from '../../service/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { jobPostModel } from '../../model/jobPost.model';
import { toggleAddressChange } from '../../state/actions/address.actions';

@Component({
  selector: 'app-add-new-job',
  templateUrl: './add-new-job.component.html',
  styleUrls: ['./add-new-job.component.css']
})
export class AddNewJobComponent {
  constructor(private store: Store, private router:Router, private fb: FormBuilder,private newJobService : JobService, private route: ActivatedRoute){}

  user$!: Observable<User>;
  userState!: User
  timeFrame!:string  
  newJobForm!: FormGroup;
  urgency!: any;
  sub!: Promise<any>;
  disabledFlag: boolean = true
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
  salaryRadioFlag: boolean = false
  salaryStart: number = 0;
  salaryEnd: number = 0;
  flag!: Instance[] | Instance;
  arlStations$!: Observable<string[]>;
  srtStations$!: Observable<string[]>;
  btsStations$!: Observable<string[]>;
  mrtStations$!: Observable<string[]>;
  display: any;
  zoom: number = 15
  center: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  }
  jobDetailsEditor = ClassicEditor;
  loadingFlag: boolean = false;
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
    this.user$ = this.store.select((state: any)=>{
      return state.user
    })
    this.user$.subscribe((user: User)=>{
      this.userState = user;
      this.userState = _.cloneDeep(user);
      if(this.userState._geoloc !== undefined){
        this.center = this.userState._geoloc
      }else{
        this.center = this.userState._geolocCurrent!
      }
      this.markerPosition = this.center
      this.initializeFormGroup();
    })

    this.newJobForm.valueChanges.subscribe((form) =>{
      if(!this.urgency){
        this.timeFrame = form.TimeFrame
      }
    })
    this.scrollUp();
  }
  salaryRadioChange(event: any){
    if(event.target.value !== 'SalaryNumbers'){
      this.salaryRadioFlag = true
      this.salaryStart = 0
      this.salaryEnd = 0
    }else{
      this.salaryRadioFlag = false
    }
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
  
  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

moveMap(event: any){
  this.markerPosition = {
    lat: event.latLng.lat(),
    lng: event.latLng.lng()
  }
  this.center = this.markerPosition
  this.newJobForm.patchValue({_geoloc: this.markerPosition})
}
searchMap(event: any){
  this.markerPosition = {
    lat: event.geometry.location.lat(),
    lng: event.geometry.location.lng()
  }
  this.center = this.markerPosition
  this.newJobForm.patchValue({_geoloc: this.markerPosition})
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
        case 'คลินิก':
          categorySymbol = 'BB';
          break;
        case 'โรงงาน':
          categorySymbol = 'BC';
          break;
        case 'บริษัท':
          categorySymbol = 'BC';
          break;
        case 'วิจัย':
          categorySymbol = 'BC';
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
      dateUpdatedUnix: [''],
      TimeFrame: [''],
      OperatorUID: [this.userState.uid],
      JobName: [''],
      Amount: [''],
      DateOfJob: [''],
      _geoloc: this.center,
      Active: [false],
      Duration: [''],
      Urgency: [this.urgency],
      Salary: this.fb.group({
        Amount:[''],
        Cap: [''],
        Suffix: 'SalaryNumbers',
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
      profilePictureUrl: this.userState.cropProfilePictureUrl !== undefined && this.userState.cropProfilePictureUrl !== ''? this.userState.cropProfilePictureUrl: this.userState.profilePictureUrl,
      coverPhotoPictureUrl:this.userState.coverPhotoPictureUrl,
      coverPhotoOffset: this.userState.coverPhotoOffset
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
  onSave(){
    let processedInfo = {};
      processedInfo = 
      {
        Salary: {
          Amount: this.salaryStart,
          Suffix: this.newJobForm.value.Salary.Suffix,
          Cap: this.salaryEnd - this.salaryStart
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
      dateUpdatedUnix: Math.floor(new Date().getTime() / 1000)
    }
    this.newJobForm.patchValue(processedInfo)
    this.loadingFlag = true;
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
      this.loadingFlag = false;
      this.router.navigate(['operator/profile-operator/all-jobs-posts'])
    })
  }
}

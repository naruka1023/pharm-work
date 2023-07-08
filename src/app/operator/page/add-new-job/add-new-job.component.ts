import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Contacts, User } from '../../model/user.model';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Instance } from 'flatpickr/dist/types/instance';
import { JobService } from '../../service/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { jobPostModel } from '../../model/jobPost.model';
import { toggleAddressChange } from '../../state/actions/address.actions';
import Validation from 'src/app/utils/validation';

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
  submitted: boolean = false
  locationSubmitted: boolean = false
  disabledFlag: boolean = true
  nearBTSFlag: boolean = false
  nearARLFlag: boolean = false
  nearMRTFlag: boolean = false
  nearSRTFlag: boolean = false
  phone$!:Observable<string>;
  email$!:Observable<string>;
  line$!:Observable<string>;
  facebook$!:Observable<string>;
  salaryRadioFlag: boolean = false
  flag!: Instance[] | Instance;
  arlStations$!: Observable<string[]>;
  srtStations$!: Observable<string[]>;
  btsStations$!: Observable<string[]>;
  mrtStations$!: Observable<string[]>;
  display: any;
  zoom: number = 15
  center: any = 'undefined';
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
    this.initializeFormGroup();
    this.newJobForm.get('Salary.salaryStart')!.addValidators(Validators.max(this.newJobForm.value.Salary.salaryEnd))

    this.newJobForm.statusChanges.subscribe((value: any)=>{
      if(value !== 'VALID'){
        this.newJobForm.get('Salary.salaryStart')!.setValidators([Validators.max(this.newJobForm.value.Salary.salaryEnd), Validators.required])
        this.newJobForm.get('Salary.salaryStart')!.updateValueAndValidity({onlySelf:true})
      }
    })
    this.newJobForm.valueChanges.subscribe((form: any) =>{
      if(!this.urgency){
        this.timeFrame = form.TimeFrame
      }
    })
    this.scrollUp();
  }

  cancelClick(){
    this.router.navigate(['operator'])
  }

  salaryRadioChange(event: any){
    if(event.target.value !== 'SalaryNumbers'){
      this.newJobForm.get('Salary.salaryEnd')!.disable()
      this.newJobForm.get('Salary.salaryStart')!.disable()
      this.newJobForm.get('Salary.salaryStart')?.patchValue(null)
      this.newJobForm.get('Salary.salaryEnd')?.patchValue(null)
    }else{
      this.newJobForm.get('Salary.salaryStart')!.enable()
      this.newJobForm.get('Salary.salaryEnd')!.enable()
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

  get getNewJobForm(): { [key: string]: AbstractControl } { 
    return this.newJobForm.controls;
  }
  initializeFormGroup(){
    this.newJobForm = this.fb.group({
      JobType: this.userState.jobType,
      Establishment: this.userState.companyName,
      CategorySymbol: this.mapJobTypeToCategorySymbol(),
      dateCreated: [''],
      dateUpdated: [''],
      dateUpdatedUnix: [''],
      TimeFrame: [this.urgency?'Part-Time': '', [Validators.required]],
      OperatorUID: [this.userState.uid],
      JobName: ['', [Validators.required]],
      Amount: ['', [Validators.required]],
      _geoloc: [this.center, [Validators.required]],
      Active: [false],
      Duration: [''],
      timeStart: [''],
      timeEnd: [''],
      Urgency: [this.urgency],
      Salary: this.fb.group({
        Amount:[''],
        Cap: [''],
        Suffix: 'SalaryNumbers',
        salaryStart: [{value: '', disabled:this.salaryRadioFlag}, [Validators.required]],
        salaryEnd: [{value: '', disabled:this.salaryRadioFlag}]
      }, 
     ),
      OnlineInterview: [false],
      WorkFromHome: [false],
      Location: this.fb.group({
        Section: ['', [Validators.required]],
        District: ['', [Validators.required]],
        Province: ['', [Validators.required]],
      }),
      Contacts: this.fb.group({
        phone: [this.userState.contacts?.phone, [Validators.required]],
        email: [this.userState.contacts?.email, [Validators.required]],
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
      JobDetails: ['', [Validators.required]],
      TravelInstructions: ['', [Validators.required]],
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
      this.newJobForm.addControl('DateOfJob', this.fb.control('', Validators.required))
    }else{
      this.newJobForm.addControl('qualityApplicants', this.fb.control('', Validators.required)); 
      this.newJobForm.addControl('jobBenefits', this.fb.control('', Validators.required)); 
      this.newJobForm.addControl('applyInstructions', this.fb.control('', Validators.required)); 
    } 
  }
  onSave(){
    this.submitted = true;
    this.locationSubmitted = true
    if(this.newJobForm.invalid ){
      return
    }else{
      let processedInfo = {};
        processedInfo = 
        {
          Salary: {
            Amount: this.newJobForm.value.Salary.salaryStart,
            Suffix: this.newJobForm.value.Salary.Suffix,
            Cap: (this.newJobForm.value.Salary.salaryEnd !== '')? this.newJobForm.value.Salary.salaryEnd - this.newJobForm.value.Salary.salaryStart: 0
          }
        };
        processedInfo = 
        {
          ...processedInfo,
          Duration: this.newJobForm.value.timeStart + ' - ' + this.newJobForm.value.timeStart
        }
        this.newJobForm.removeControl('timeStart')
        this.newJobForm.removeControl('timeEnd')
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
      let postJobForm = this.newJobForm.value
      delete postJobForm.Salary.salaryStart
      delete postJobForm.Salary.salaryEnd

      this.loadingFlag = true;
      if(this.urgency){
        if(postJobForm.DateOfJob.length > 1){
          this.sub = this.newJobService.addMultipleJobs(postJobForm)
        }else{
          if(this.newJobForm.value.DateOfJob.length !== 0){
            let processedDate = postJobForm.DateOfJob[0].toISOString().split('T')[0]
            postJobForm = {
              ...postJobForm,
              DateOfJob:processedDate
            }
          }
          this.sub = this.newJobService.addOneJob(postJobForm)
        }
      }else{
        this.sub = this.newJobService.addOneJob(postJobForm)
      }
      this.sub.then((job)=>{
        this.loadingFlag = false;
        this.router.navigate(['operator/profile-operator/all-jobs-posts'])
      })
    }
  }
}

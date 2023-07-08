import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Instance } from 'flatpickr/dist/types/instance';
import { Observable, Subscription, take } from 'rxjs';
import { User } from '../../model/user.model';
import { JobService } from '../../service/job.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as _ from 'lodash';
import { jobPostModel } from '../../model/jobPost.model';

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.css']
})
export class EditJobComponent implements OnDestroy{
  constructor(private store: Store, private fb: FormBuilder,private editJobService : JobService, private router:Router, private route: ActivatedRoute){}

  user$!: Observable<User>;
  userState!: User
  newJobForm!: FormGroup;
  urgency!: any;
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
  locationSubmitted: boolean = false
  sub!: Promise<any>;
  subToDestroy: Subscription = new Subscription();
  dateOfJob!: any
  timeStart: string = '';
  timeEnd: string = '';
  submitted: boolean = false
  updateLoading: boolean = false;
  salaryRadioFlag: boolean = false
  salaryStart: number = 0;
  salaryEnd: number = 0;
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
    this.urgency = (this.route.snapshot.queryParamMap.get('urgency')! == 'false')?false: true;
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
    })
    this.initializeFormGroup();
    this.newJobForm.get('Salary.salaryStart')!.addValidators(Validators.max(this.newJobForm.value.Salary.salaryEnd))

    this.newJobForm.statusChanges.subscribe((value: any)=>{
      if(value !== 'VALID'){
        this.newJobForm.get('Salary.salaryStart')!.setValidators([Validators.max(this.newJobForm.value.Salary.salaryEnd), Validators.required])
        this.newJobForm.get('Salary.salaryStart')!.updateValueAndValidity({onlySelf:true})
      }
    })    
    let uid = this.route.snapshot.queryParamMap.get('id');
    this.subToDestroy = this.store.select((state:any)=>{
      let newState = _.cloneDeep(state.createdJobs.JobPost) as jobPostModel[];
      return newState.find((job)=>{
        return uid === job.custom_doc_id
      })
    }).pipe(take(1)).subscribe((state: any)=>{
      if(this.userState._geoloc !== undefined){
        this.center = this.userState._geoloc
      }else{
        this.center = this.userState._geolocCurrent!
      }
      this.markerPosition = this.center
      this.newJobForm.patchValue({
        ...state,
        _geoloc:this.center
      });
      let job: jobPostModel = this.newJobForm.value;
      if(this.urgency){
        this.newJobForm.addControl('DateOfJob', this.fb.control('')); 
        this.newJobForm.patchValue({
          ...this.newJobForm.value,
          DateOfJob: job.DateOfJob
        })
      }
      this.newJobForm.patchValue({
        ...this.newJobForm.value,
        Salary: {
          ...this.newJobForm.value.Salary,
          salaryStart: job.Salary.Amount,
          salaryEnd: job.Salary.Amount + job.Salary.Cap!
        }
      })
      this.salaryStart = job.Salary.Amount,
      this.salaryEnd = job.Salary.Amount + job.Salary.Cap!
      this.timeStart = job.Duration.split(' - ')[0];
      this.timeEnd = job.Duration.split(' - ')[1];
    })
    this.scrollUp();
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

      this.newJobForm.get('Salary.salaryStart')?.patchValue(this.salaryStart)
      this.newJobForm.get('Salary.salaryEnd')?.patchValue(this.salaryEnd)
    }
  }
  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
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
  ngOnDestroy(){
    this.subToDestroy.unsubscribe();
  }
  handleCalendarChange(value: any){
    this.newJobForm.patchValue({
      DateOfJob: value.dateString
    })
  }
  cancelClick(){
    this.router.navigate(['operator/profile-operator/all-jobs-posts'])
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

  get checkboxBTS(){
    return this.newJobForm.value.BTS.Near
  }

  get checkboxMRT(){
    return this.newJobForm.value.MRT.Near
  }

  get checkboxSRT(){
    return this.newJobForm.value.SRT.Near
  }
  
  get checkboxARL(){
    return this.newJobForm.value.ARL.Near
  }
  

  initializeFormGroup(){
    this.newJobForm = this.fb.group({
      JobType: this.userState.jobType,
      Establishment: this.userState.companyName,
      CategorySymbol: this.mapJobTypeToCategorySymbol(),
      dateCreated: [''],
      dateUpdated: [''],
      TimeFrame: ['', [Validators.required]],
      OperatorUID: [this.userState.uid],
      JobName: ['', [Validators.required]],
      Amount: ['', [Validators.required]],
      Active: [false],
      _geoloc: [''],
      Duration: [''],
      Urgency: [this.urgency],
      Salary: this.fb.group({
        Amount:[''],
        Cap: [''],
        Suffix: [''],
        salaryStart: [{value: '', disabled:this.salaryRadioFlag}, [Validators.required]],
        salaryEnd: [{value: '', disabled:this.salaryRadioFlag}]
      }),
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
      custom_doc_id: [this.route.snapshot.queryParamMap.get('id')],
      JobDetails: ['', [Validators.required]],
      TravelInstructions: ['', [Validators.required]],
    });
    if(this.userState.jobType === 'ร้านยาแบรนด์'){
      this.newJobForm.addControl('Franchise', this.fb.control(['']));
    }
    if(!this.urgency){
      this.newJobForm.addControl('qualityApplicants', this.fb.control('', Validators.required)); 
      this.newJobForm.addControl('jobBenefits', this.fb.control('', Validators.required)); 
      this.newJobForm.addControl('applyInstructions', this.fb.control('', Validators.required)); 
    }else{
      this.newJobForm.addControl('DateOfJob', this.fb.control('', Validators.required))
    }
  }

  get getEditNewForm(): { [key: string]: AbstractControl } {
    return this.newJobForm.controls;
  }

  onUpdate(){
    this.submitted = true;
    this.locationSubmitted = true
    if(this.newJobForm.invalid){
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
        dateUpdated: new Date().toISOString().split('T')[0],
        dateUpdatedUnix: Math.floor(new Date().getTime() / 1000)
      }
      this.newJobForm.patchValue(processedInfo)
      let postJobForm = this.newJobForm.value
      delete postJobForm.Salary.salaryStart
      delete postJobForm.Salary.salaryEnd

      this.updateLoading = true;
      this.editJobService.editJob(postJobForm).then(()=>{
        this.router.navigate(['operator/profile-operator/all-jobs-posts'])
        this.updateLoading = false;
      })
    }
  }
}

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
import { UtilService } from '../../service/util.service';

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.css']
})
export class EditJobComponent implements OnDestroy{
  constructor(private store: Store,private utilService:UtilService, private fb: FormBuilder,private editJobService : JobService, private router:Router, private route: ActivatedRoute){}

  user$!: Observable<User>;
  userState!: User
  newJobForm!: FormGroup;
  urgency!: any;
  customSuffix: string = '';
  display: any;
  zoom: number = 15
  none: google.maps.MapOptions = {
    gestureHandling:'greedy'
  };
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
    // this.newJobForm.get('Salary.salaryStart')!.addValidators(Validators.max(this.newJobForm.value.Salary.salaryEnd))

    // this.newJobForm.statusChanges.subscribe((value: any)=>{
    //   if(value !== 'VALID'){
    //     this.newJobForm.get('Salary.salaryStart')!.setValidators([Validators.max(this.newJobForm.value.Salary.salaryEnd), Validators.required])
    //     this.newJobForm.get('Salary.salaryStart')!.updateValueAndValidity({onlySelf:true})
    //   }
    // })    
    const uid = this.route.snapshot.queryParamMap.get('id');
    this.subToDestroy = this.store.select((state:any)=>{
      const newState = _.cloneDeep(state.createdJobs.JobPost) as jobPostModel[];
      return newState.find((job)=>{
        return uid === job.custom_doc_id
      })
    }).pipe(take(1)).subscribe((state: any)=>{
       if(state._geoloc !== undefined){
        this.center = state._geoloc
       }else{
         if(this.userState._geoloc !== undefined){
           this.center = this.userState._geoloc
         }else{
           if(this.userState._geolocCurrent == undefined){
             this.center = {
               lat: 0,
               lng:0
             }
           }else{
             this.center = this.userState._geolocCurrent!
             }
         }
       }
      this.markerPosition = this.center
      this.newJobForm.patchValue({
        ...state,
        _geoloc:this.center
      });
      const job: jobPostModel = this.newJobForm.value;
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
      if(this.newJobForm.value.Salary.Suffix !== 'CorporateStructure' && this.newJobForm.value.Salary.Suffix !== 'SalaryNumbers' && this.newJobForm.value.Salary.Suffix !== 'Negotiable'){
        this.customSuffix = this.newJobForm.value.Salary.Suffix
        this.newJobForm.patchValue({
          ...this.newJobForm.value,
          Salary: {
            ...this.newJobForm.value.Salary,
            Suffix: 'CustomSuffix'
          }
        })
      }
      this.salaryStart = job.Salary.Amount,
      this.salaryEnd = job.Salary.Amount + job.Salary.Cap!
      this.newJobForm.patchValue({
        timeStart: job.Duration.split(' - ')[0],
        timeEnd: job.Duration.split(' - ')[1],
      })
    })
    this.scrollUp();
  }
  salaryRadioChange(event: any){
    if(event.target.value !== 'SalaryNumbers'){
      this.newJobForm.get('Salary.salaryEnd')!.disable()
      this.newJobForm.get('Salary.salaryEnd')?.patchValue("")
      this.newJobForm.get('Salary.salaryStart')!.disable()
      this.newJobForm.get('Salary.salaryStart')?.patchValue("")
    }else{
      this.newJobForm.get('Salary.salaryEnd')!.enable()
      this.newJobForm.get('Salary.salaryEnd')?.patchValue(this.salaryEnd)
      this.newJobForm.get('Salary.salaryStart')!.enable()

      this.newJobForm.get('Salary.salaryStart')?.patchValue(this.salaryStart)
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
  this.utilService.getMapAddress(this.markerPosition.lng.toString(), this.markerPosition.lat.toString()).subscribe((result: any)=>{
    this.newJobForm.patchValue({Address: result.results[0].formatted_address})
  })
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
      dateUpdatedUnix: [''],
      TimeFrame: ['', [Validators.required]],
      Address: [''],
      OperatorUID: [this.userState.uid],
      JobName: ['', [Validators.required]],
      Amount: ['', [Validators.required]],
      Active: [false],
      _geoloc: [''],
      Duration: [''],
      timeStart: this.urgency?['', [Validators.required]]: [''],
      timeEnd: [''],
      Urgency: [this.urgency],
      Salary: this.fb.group({
        Amount:[''],
        Cap: [''],
        Suffix: [''],
        salaryStart: ['', [Validators.required]],
        salaryEnd: ['']
      }),
      OnlineInterview: [false],
      WorkFromHome: [false],
      Location: this.fb.group({
        Section: ['', [Validators.required]],
        District: ['', [Validators.required]],
        Province: ['', [Validators.required]],
      }),
      Contacts: this.fb.group({
        nameRepresentative: ['', [Validators.required]],
        areaOfContact: [''],        
        phone: ['', [Validators.required]],
        email: ['', [Validators.required]],
        website: [''],
        line: [''],
        facebook: ['']
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
      this.newJobForm.addControl('jobBenefits', this.fb.control('', Validators.required)); 
    }else{
      this.newJobForm.addControl('DateOfJob', this.fb.control('', Validators.required))
    }
    this.newJobForm.addControl('qualityApplicants', this.fb.control('', Validators.required)); 
    this.newJobForm.addControl('applyInstructions', this.fb.control('', Validators.required)); 
  }

  get getEditNewForm(): { [key: string]: AbstractControl } {
    return this.newJobForm.controls;
  }

  styleSelect(id: string){
    document.getElementById(id)!.style.color = 'black'
  }
  
  onUpdate(){
    this.submitted = true;
    this.locationSubmitted = true
    if(this.newJobForm.invalid){
      return
    }else{
      let processedInfo: any = {};
        processedInfo = 
        {
          Salary: {
            Amount: this.newJobForm.value.Salary.salaryStart == undefined? 0: Math.round(this.newJobForm.value.Salary.salaryStart),
            Suffix: this.newJobForm.value.Salary.Suffix == 'CustomSuffix'? this.customSuffix:this.newJobForm.value.Salary.Suffix,
            Cap: (this.newJobForm.value.Salary.salaryEnd !== null &&this.newJobForm.value.Salary.salaryEnd !== undefined && this.newJobForm.value.Salary.salaryEnd !== '' && this.newJobForm.value.Salary.salaryEnd !== 0)? Math.round(this.newJobForm.value.Salary.salaryEnd - this.newJobForm.value.Salary.salaryStart): 0
          }
        };
        processedInfo.Salary!.Amount = Math.round(processedInfo.Salary!.Amount);
        processedInfo.Salary!.Cap = Math.round(processedInfo.Salary!.Cap);
        processedInfo = 
        {
          ...processedInfo,
          Duration: this.newJobForm.value.timeStart + ' - ' + this.newJobForm.value.timeEnd
        }
        this.newJobForm.removeControl('timeStart')
        this.newJobForm.removeControl('timeEnd')
      processedInfo = {
        ...processedInfo, 
        Urgency: this.urgency,
        dateUpdated: new Date().toISOString().split('T')[0],
        dateUpdatedUnix: Math.floor(new Date().getTime() / 1000)
      }
      this.newJobForm.patchValue(processedInfo)
      const postJobForm = this.newJobForm.value
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

import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import SwiperCore, { Autoplay, Mousewheel, Navigation, Pagination } from "swiper";
import { UserPharma } from '../../model/user.model';
import { JobTypeConverterService } from '../../service/job-type-converter.service';
import { UsersService } from '../../service/users.service';
import { UtilService } from '../../service/util.service';
import { toggleAddressChange } from '../../state/actions/address.actions';
import { funnelUsers, toggleLoading } from '../../state/actions/users-actions';
import { DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

SwiperCore.use([Navigation, Pagination, Autoplay, Mousewheel]);

@Component({
  selector: 'app-operator-home',
  templateUrl: './operator-home.component.html',
  styleUrls: ['./operator-home.component.css']
})
export class OperatorHomeComponent implements OnDestroy{

  constructor(private converter: JobTypeConverterService,private store: Store,private router:Router, private route:ActivatedRoute, private fb:FormBuilder, private userService:UsersService){}
  
  userJobType$!: Observable<string>;
  locationRadiusFlag!: boolean
  loadingUsers$!: Observable<boolean>;
  
  loadingFlag:boolean = true;
  loadingNormalFlag: boolean = false;
  loadingUrgentFlag: boolean = false;
  emptyResultFlag: boolean = false;
  emptyUrgentResultFlag: boolean = false;
  accuracy: number = 0
  jobType: string = ''
  _geoLoc: any = {}
  submitted:boolean = false;
  newUserForm!: FormGroup;
  newUserFormUrgent!: FormGroup;
  subscription: Subscription = new Subscription()
  province$!: Observable<string[]>;
  district$!: Observable<string[]>;
  section$!: Observable<string[]>;
  provinceUrgent$!: Observable<string[]>;
  districtUrgent$!: Observable<string[]>;
  sectionUrgent$!: Observable<string[]>;
  mapData = this.converter.getPlaceHolderObject();

  ngOnInit(){
    this.scrollUp();
    this.loadingUsers$ = this.store.select((state:any)=>{
      return state.users.loading
    });
    this.userJobType$ = this.store.select((state:any)=>{
      return state.user.jobType
    });
    this.userJobType$.subscribe((jobType)=>{
      this.jobType = jobType
      this.initializeFormGroup()
    })
    this.loadingUsers$.subscribe((loading)=>{
      if(loading){
        this.userService.getAllPharmaUsers().then((allUsers)=>{
          this.store.dispatch(funnelUsers({allUsers: allUsers}))
        })
      }else{
        this.loadingFlag = false
      }
    })
    this.store.select((state: any)=>{
      return state.user._geolocCurrent
    }).subscribe((_geoloc: any)=>{
      this._geoLoc = _geoloc
    })
    this.initializeFormGroup();
    this.initializeFormGroupUrgent();
    this.provinceUrgent$ = this.store.select((state: any)=>{
      let result = Object.keys(state.address.list);
      return result
    })
    this.districtUrgent$ = this.store.select((state: any)=>{
      if(this.newUserFormUrgent.value.preferredLocation.Province === '' || this.newUserFormUrgent.value.preferredLocation.Province === null){
        return [];
      }
      return Object.keys(state.address.list[this.newUserFormUrgent.value.preferredLocation.Province])
    })
    this.sectionUrgent$ = this.store.select((state: any)=>{
      if(this.newUserFormUrgent.value.preferredLocation.District === '' || this.newUserFormUrgent.value.preferredLocation.District === null){
        return [];
      }
      let section: string[] = state.address.list[this.newUserFormUrgent.value.preferredLocation.Province][this.newUserFormUrgent.value.preferredLocation.District].map((section: any)=>section.section);
      return section
    })
    this.subscription.add(this.sectionUrgent$.subscribe())
    this.subscription.add(this.provinceUrgent$.subscribe())
    this.subscription.add(this.districtUrgent$.subscribe())
    this.province$ = this.store.select((state: any)=>{
      let result = Object.keys(state.address.list);
      return result
    })
    this.district$ = this.store.select((state: any)=>{
      if(this.newUserForm.value.preferredLocation.Province === '' || this.newUserForm.value.preferredLocation.Province === null){
        return [];
      }
      return Object.keys(state.address.list[this.newUserForm.value.preferredLocation.Province])
    })
    this.section$ = this.store.select((state: any)=>{
      if(this.newUserForm.value.preferredLocation.District === '' || this.newUserForm.value.preferredLocation.District === null){
        return [];
      }
      let section: string[] = state.address.list[this.newUserForm.value.preferredLocation.Province][this.newUserForm.value.preferredLocation.District].map((section: any)=>section.section);
      return section
    })
    this.subscription.add(this.section$.subscribe())
    this.subscription.add(this.province$.subscribe())
    this.subscription.add(this.district$.subscribe())
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  provinceSelectedUrgent($event:any){
    this.newUserFormUrgent.patchValue({
      ...this.newUserFormUrgent.value.value,
      preferredLocation:{
        District:'',
          Section:''
        }
      })
      this.store.dispatch(toggleAddressChange())
    }
    districtSelectedUrgent($event:any){
      this.newUserFormUrgent.patchValue({
        ...this.newUserFormUrgent.value,
        preferredLocation:{
          Section:''
        }
      })
      this.store.dispatch(toggleAddressChange())
    }
  provinceSelected($event:any){
    this.newUserForm.patchValue({
      ...this.newUserForm.value.value,
      preferredLocation:{
        District:'',
          Section:''
        }
      })
      this.store.dispatch(toggleAddressChange())
    }
    districtSelected($event:any){
      this.newUserForm.patchValue({
        ...this.newUserForm.value,
        preferredLocation:{
          Section:''
        }
    })
      this.store.dispatch(toggleAddressChange())
    }
  sectionSelected($event:any){
    this.store.dispatch(toggleAddressChange())
  }
  initializeFormGroupUrgent(){
    this.newUserFormUrgent = this.fb.group({
      jobType: [''],
      onlineFlag: false,
      radius: [''],
      nearbyFlag: false,
      amountCompletedSort:[''],
      _geoloc:[''],
      preferredLocation: this.fb.group({
        Section: [''],
        District: [''],
        Province: [''],
      }),
    })
    this.locationRadiusFlag = this.newUserFormUrgent.value.radiusFlag
  }
  initializeFormGroup(){
    this.newUserForm = this.fb.group({
      preferredTimeFrame: [''],
      jobType: ['งาน' + this.jobType, Validators.required],
      WorkExperience: [''],
      highestEducation: [''],
      active: [''],
      preferredLocation: this.fb.group({
        Section: [''],
        District: [''],
        Province: [''],
      }),
    })
  }

  get login(): { [key: string]: AbstractControl } {
    return this.newUserForm.controls;
  }

  resetUrgent(){
    this.initializeFormGroupUrgent();
    this.store.dispatch(toggleAddressChange())
  }

  reset(){
    this.initializeFormGroup();
    this.submitted = false
    this.store.dispatch(toggleAddressChange())
  }

  searchUsersUrgent(){
    if(this.newUserFormUrgent.invalid){
      return
    }else{
      this.newUserFormUrgent.patchValue({_geoloc:this._geoLoc})
      this.newUserFormUrgent.patchValue({
        jobType: 'S', 
      })
      this.router.navigateByUrl('operator/users-list', { state: this.newUserFormUrgent.value});
    }
  }
  searchUsers(){
    this.submitted = true
    if(this.newUserForm.invalid){
      return 
    }else{
      this.newUserForm.patchValue({
        jobType: this.converter.getCategorySymbolFromTitle(this.newUserForm.value.jobType), 
      })
      this.router.navigateByUrl('operator/users-list', { state: this.newUserForm.value});
    }
  }

  onChangeEvent(event: any){
    this.locationRadiusFlag = event.target.checked;
  }
  
  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }
}

import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

SwiperCore.use([Navigation, Pagination, Autoplay, Mousewheel]);

@Component({
  selector: 'app-operator-home',
  templateUrl: './operator-home.component.html',
  styleUrls: ['./operator-home.component.css']
})
export class OperatorHomeComponent implements OnDestroy{

  constructor(private converter: JobTypeConverterService,private store: Store, private fb:FormBuilder, private userService:UsersService){}
  
  userJobType$!: Observable<string>;
  locationRadiusFlag!: boolean
  loadingUsers$!: Observable<boolean>;
  
  loadingFlag:boolean = true;
  loadingNormalFlag: boolean = false;
  loadingUrgentFlag: boolean = false;
  emptyResultFlag: boolean = false;
  emptyUrgentResultFlag: boolean = false;
  accuracy: number = 0
  _geoLoc: any = {}
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
  resetUrgent(){
    this.initializeFormGroupUrgent();
    this.store.dispatch(toggleAddressChange())
  }

  reset(){
    this.initializeFormGroup();
    this.store.dispatch(toggleAddressChange())
  }
  searchUsersUrgent(){
    // if(this.accuracy < 20){
      this.newUserFormUrgent.patchValue({_geoloc:this._geoLoc})
    // }
    console.log(this.accuracy)
    this.loadingUrgentFlag = true
    this.userService.searchPharmaUsersUrgent(this.newUserFormUrgent.value).then((users)=>{
      this.emptyUrgentResultFlag = true
      if(users['S'] !== undefined){
        this.emptyUrgentResultFlag = false
      }
      this.resetUrgent()
      this.store.dispatch(funnelUsers({allUsers:users}))
      this.loadingUrgentFlag = false
    });
  }
  searchUsers(){
    this.loadingNormalFlag = true
    this.userService.searchPharmaUsers(this.newUserForm.value).then((users)=>{
      this.emptyResultFlag = true
      Object.keys(users).forEach((categorySymbol)=>{
        if(users[categorySymbol] !== undefined){
          this.emptyResultFlag = false
        }
      })
      this.reset()
      this.store.dispatch(funnelUsers({allUsers:users}))
      this.loadingNormalFlag = false
    });
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

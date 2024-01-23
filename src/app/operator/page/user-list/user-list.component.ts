import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';
import { UserPharma, userPharmaList } from '../../model/user.model';
import { JobTypeConverterService } from '../../service/job-type-converter.service';
import { UsersService } from '../../service/users.service';
import { UtilService } from '../../service/util.service';
import { toggleAddressChange } from '../../state/actions/address.actions';
import { SetUsersByJobType, updateUsersByJobType } from '../../state/actions/users-actions';
declare let window: any;
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  accuracy!: number;
  _geoLoc: any;
  locationRadiusFlag: boolean = true;
  constructor(private store:Store, private fb:FormBuilder,private router: Router,private route: ActivatedRoute, private converter:JobTypeConverterService, private utilService:UtilService ,private userService:UsersService){
  }
  @Input() type!: string;
  title!: string;
  distance: number = 1.5
  throttle: number = 500
  paginationIndex:number = 0
  maxIndex: number = 0
  newTitle!: string;
  query: string = ''
  stuff!: string;
  indexName: string = 'pharm-work_user_index'
  emptyResultFlag: boolean = false;
  geoLocFlag!: boolean;
  infiniteScrollingLoadingFlag: boolean = false;
  loadingFlag: boolean = true;
  Users$!: Observable<UserPharma[]>
  newUserFormList!: FormGroup;
  newUserFormUrgent!: FormGroup;
  nearMapFlag: boolean = false;
  province$!: Observable<string[]>;
  district$!: Observable<string[]>;
  section$!: Observable<string[]>;
  provinceUrgent$!: Observable<string[]>;
  districtUrgent$!: Observable<string[]>;
  sectionUrgent$!: Observable<string[]>;
  
  ngOnInit(){
    this.loadingFlag = true;
    this.title = this.converter.getTitleFromCategorySymbol(this.type);
    this.type = this.type == 'S'?'S': 'N'
    this.newTitle = this.converter.getNewTitleFromCategorySymbol(this.type);
    if(this.type == 'S'){
      this.userService.getUrgentPharmaUserByJobType(this.paginationIndex).then((users)=>{
        this.query = users.query
        this.maxIndex = users.totalPage
        this.paginationIndex++
        this.store.dispatch(SetUsersByJobType({users:users.result, jobType:this.type}))
        this.loadingFlag = false;
      })

    }else{
      this.userService.getPharmaUserByJobType(this.paginationIndex).then((users)=>{
        this.query = users.query
        this.maxIndex = users.totalPage
        this.paginationIndex++
        this.store.dispatch(SetUsersByJobType({users:users.result, jobType:this.type}))
        this.loadingFlag = false;
      })

    }
    this.store.select((state: any)=>{
      return state.user
    }).subscribe((user: any)=>{
      if(user._geoloc == undefined){
        if(user._geolocCurrent == undefined){
          this._geoLoc = {
            lat: 0,
            lng: 0
          }
        }else{
          this._geoLoc = user._geolocCurrent
        }
      }else{
        this._geoLoc = user._geoloc
      }
      this.geoLocFlag = user._geoloc == undefined
    })
    this.Users$ = this.store.select((state:any)=>{
      return state.users.users[this.type].long;
    }).pipe(
      map((users:userPharmaList)=>{
        return this.utilService.convertUserPharmaListToArray(users);
      })
    )
    this.Users$.subscribe((users)=>{
      this.emptyResultFlag = users.length == 0? true: false
    })

    if(this.type == 'S'){
      this.initializeFormGroupUrgent();

      this.provinceUrgent$ = this.store.select((state: any)=>{
        const result = Object.keys(state.address.list);
        return result
      })
      this.provinceUrgent$.subscribe(()=>{})

      this.districtUrgent$ = this.store.select((state: any)=>{
        if(this.newUserFormUrgent.value.preferredUrgentLocation.Province === '' || this.newUserFormUrgent.value.preferredUrgentLocation.Province === null){
          return [];
        }
        return Object.keys(state.address.list[this.newUserFormUrgent.value.preferredUrgentLocation.Province])
      })
      this.districtUrgent$.subscribe(()=>{})

      this.sectionUrgent$ = this.store.select((state: any)=>{
        if(this.newUserFormUrgent.value.preferredUrgentLocation.District === '' || this.newUserFormUrgent.value.preferredUrgentLocation.District === null){
          return [];
        }
        const section: string[] = state.address.list[this.newUserFormUrgent.value.preferredUrgentLocation.Province][this.newUserFormUrgent.value.preferredUrgentLocation.District].map((section: any)=>section.section);
        return section
      })
      this.sectionUrgent$.subscribe(()=>{})
    }else{
      this.initializeFormGroup();
      this.province$ = this.store.select((state: any)=>{
        const result = Object.keys(state.address.list);
        return result
      })
      this.district$ = this.store.select((state: any)=>{
        if(this.newUserFormList.value.preferredLocation.Province === '' || this.newUserFormList.value.preferredLocation.Province === null){
          return [];
        }
        return Object.keys(state.address.list[this.newUserFormList.value.preferredLocation.Province])
      })
      this.section$ = this.store.select((state: any)=>{
        if(this.newUserFormList.value.preferredLocation.District === '' || this.newUserFormList.value.preferredLocation.District === null){
          return [];
        }
        const section: string[] = state.address.list[this.newUserFormList.value.preferredLocation.Province][this.newUserFormList.value.preferredLocation.District].map((section: any)=>section.section);
        return section
      })
    }



    this.scrollUp();
  }
  provinceSelectedUrgent($event:any){
    this.newUserFormUrgent.patchValue({
      ...this.newUserFormUrgent.value,
      Location:{
        District:'',
          Section:''
        }
      })
      this.store.dispatch(toggleAddressChange())
    }
    districtSelectedUrgent($event:any){
      this.newUserFormUrgent.patchValue({
        ...this.newUserFormUrgent.value,
        Location:{
          Section:''
        }
      })
      this.store.dispatch(toggleAddressChange())
    }
  onScroll() {
    if(this.paginationIndex < this.maxIndex){
      this.infiniteScrollingLoadingFlag = true
      this.userService.paginateJobTypeResult(this.newUserFormUrgent,this.type, this.paginationIndex, this.query, this.indexName, this.nearMapFlag).then((user)=>{
        this.paginationIndex++
        this.store.dispatch(updateUsersByJobType({users:user, jobType:this.type}))
        this.infiniteScrollingLoadingFlag = false;
      })
    }

  }
  onChangeEvent(event: any){
    this.locationRadiusFlag = event.target.checked;
    if(this.locationRadiusFlag && this.geoLocFlag){
      document.getElementById('flexSwitchCheckDefault')?.click()
      this.router.navigate(['operator/profile-operator'], {
        queryParams:{
          googleMapPointer:true
        }
      }).then(()=>{
        // this.offCanvas.hide()
      })
    }
  }
  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }
  provinceSelected($event:any){
    this.newUserFormList.patchValue({
        ...this.newUserFormList.value,
        preferredLocation:{
          District:'',
          Section:''
        }
    })
    this.store.dispatch(toggleAddressChange())
  }
  districtSelected($event:any){
    this.newUserFormList.patchValue({
        ...this.newUserFormList.value,
        preferredLocation:{
          Section:''
        }
    })
    this.store.dispatch(toggleAddressChange())
  }

  sectionSelected($event:any){
    this.store.dispatch(toggleAddressChange())
  }

  searchUsers(){
    this.loadingFlag = true;
    this.paginationIndex = 0
    this.userService.searchPharmaUsersByPreferredJobType(this.newUserFormList.value).then((users)=>{
      this.utilService.populateLocationFieldsWithObject(this.newUserFormList.value)
      this.maxIndex = users.totalPage
      this.query = users.query
      this.indexName = users.indexName
      this.paginationIndex++;
      this.store.dispatch(SetUsersByJobType({users:users.results, jobType:this.type}))
      this.loadingFlag = false;
    })
  }

  initializeFormGroup(){
    this.newUserFormList = this.fb.group({
      preferredJobType: [''],
      preferredTimeFrame: [''], 
      WorkExperience: [''],
      preferredLocation: this.fb.group({
        Section: [''],
        District: [''],
        Province: [''],
      }),
      highestEducation: [''],
      active: ['']
    })
  }
  
  initializeFormGroupUrgent(){
    this.newUserFormUrgent = this.fb.group({
      highestEducation: [''],
      urgentTimeFrame: [''],
      urgentPreferredDay: [''],
      radius: [''],
      nearbyFlag: false,
      _geoloc:[''],
      preferredUrgentLocation: this.fb.group({
        Section: [''],
        District: [''],
        Province: [''],
      }),
    })
    this.locationRadiusFlag = this.newUserFormUrgent.value.nearbyFlag
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
    this.newUserFormUrgent.patchValue({_geoloc:this._geoLoc})
    this.paginationIndex = 0
    this.loadingFlag = true
    if(this.newUserFormUrgent.value.nearbyFlag && this.newUserFormUrgent.value.radius == ''){
      this.newUserFormUrgent.patchValue({
        preferredUrgentLocation: {
          Section: '',
          District: '',
          Province: ''
        }
      })
    }
    this.userService.searchPharmaUsersUrgentByPreferredJobType(this.newUserFormUrgent.value).then((users)=>{
      this.utilService.populateUrgentLocationFieldsWithObject(this.newUserFormUrgent.value)
      this.maxIndex = users.totalPage
      this.paginationIndex++
      this.query = users.query
      this.indexName = users.indexName
      this.store.dispatch(SetUsersByJobType({users:users.results, jobType:this.type}))
      this.loadingFlag = false
    });
  }
}

import { Component } from '@angular/core';
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
declare var window: any;
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
    let extras = this.router.getCurrentNavigation()?.extras
    if(extras!.state !== undefined){
      this.type = this.router.getCurrentNavigation()!.extras.state!['jobType']
      this.headerSearchFlag = true;
      if(this.type !== 'S'){
        this.initializeFormGroup();
        this.newUserFormList.patchValue(this.router.getCurrentNavigation()!.extras.state!)
      }else{
        this.initializeFormGroupUrgent();
        this.newUserFormUrgent.patchValue(this.router.getCurrentNavigation()!.extras.state!)
        this.locationRadiusFlag = this.newUserFormUrgent.value.nearbyFlag
      }
    }
  }
  type!: string;
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
  infiniteScrollingLoadingFlag: boolean = false;
  loadingFlag: boolean = true;
  headerSearchFlag!: boolean
  Users$!: Observable<UserPharma[]>
  newUserFormList!: FormGroup;
  newUserFormUrgent!: FormGroup;
  nearMapFlag: boolean = false;
  province$!: Observable<string[]>;
  district$!: Observable<string[]>;
  section$!: Observable<string[]>;
  searchModal: any
  provinceUrgent$!: Observable<string[]>;
  districtUrgent$!: Observable<string[]>;
  sectionUrgent$!: Observable<string[]>;
  ngOnInit(){
    this.loadingFlag = true;
    if(this.type == undefined){
      this.type = this.route.snapshot.queryParamMap.get('type')!;
      this.headerSearchFlag = false;
    }
    this.searchModal = new window.bootstrap.Modal(
      document.getElementById('searchModal')
      );
    this.title = this.converter.getTitleFromCategorySymbol(this.type);
    this.newTitle = this.converter.getNewTitleFromCategorySymbol(this.type);
    if(this.headerSearchFlag){
      if(this.type !== 'S'){
        this.searchUsers()
      }else{
        this.searchUsersUrgent()
      }
    }else{
      this.userService.getPharmaUserByJobType(this.title, this.paginationIndex).then((users)=>{
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
        this._geoLoc = user._geolocCurrent
      }else{
        this._geoLoc = user._geoloc
      }
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
      if(!this.headerSearchFlag){
        this.initializeFormGroupUrgent();
      }
      this.provinceUrgent$ = this.store.select((state: any)=>{
        let result = Object.keys(state.address.list);
        return result
      })
      this.provinceUrgent$.subscribe(()=>{})
      this.districtUrgent$ = this.store.select((state: any)=>{
        if(this.newUserFormUrgent.value.Location.Province === '' || this.newUserFormUrgent.value.Location.Province === null){
          return [];
        }
        return Object.keys(state.address.list[this.newUserFormUrgent.value.Location.Province])
      })
      this.districtUrgent$.subscribe(()=>{})
      this.sectionUrgent$ = this.store.select((state: any)=>{
        if(this.newUserFormUrgent.value.Location.District === '' || this.newUserFormUrgent.value.Location.District === null){
          return [];
        }
        let section: string[] = state.address.list[this.newUserFormUrgent.value.Location.Province][this.newUserFormUrgent.value.Location.District].map((section: any)=>section.section);
        return section
      })
      this.sectionUrgent$.subscribe(()=>{})
    }else{
      if(!this.headerSearchFlag){
        this.initializeFormGroup();
      }
      this.province$ = this.store.select((state: any)=>{
        let result = Object.keys(state.address.list);
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
        let section: string[] = state.address.list[this.newUserFormList.value.preferredLocation.Province][this.newUserFormList.value.preferredLocation.District].map((section: any)=>section.section);
        return section
      })
    }



    this.scrollUp();
  }
  provinceSelectedUrgent($event:any){
    this.newUserFormUrgent.patchValue({
      ...this.newUserFormUrgent.value.value,
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
        ...this.newUserFormList.value.value,
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
    this.searchModal.hide()
    this.userService.searchPharmaUsersByPreferredJobType(this.newUserFormList.value, this.type).then((users)=>{
      this.maxIndex = users.totalPage
      this.paginationIndex++
      this.query = users.query
      this.indexName = users.indexName
      this.store.dispatch(SetUsersByJobType({users:users.results, jobType:this.type}))
      this.loadingFlag = false;
    })
  }
  initializeFormGroup(){
    this.newUserFormList = this.fb.group({
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
      onlineFlag: false,
      radius: [500],
      nearbyFlag: false,
      _geoloc:[''],
      Location: this.fb.group({
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
    if(!this.headerSearchFlag){
      this.newUserFormUrgent.patchValue({_geoloc:this._geoLoc})
    }
    this.paginationIndex = 0
    this.loadingFlag = true
    if(this.newUserFormUrgent.value.nearbyFlag && this.newUserFormUrgent.value.radius == ''){
      this.newUserFormUrgent.patchValue({
        Location: {
          Section: '',
          District: '',
          Province: ''
        }
      })
    }
    this.searchModal.hide()
    this.userService.searchPharmaUsersUrgentByPreferredJobType(this.newUserFormUrgent.value).then((users)=>{
      this.maxIndex = users.totalPage
      this.paginationIndex++
      this.query = users.query
      this.indexName = users.indexName
      this.store.dispatch(SetUsersByJobType({users:users.results, jobType:this.type}))
      this.loadingFlag = false
    });
  }
}

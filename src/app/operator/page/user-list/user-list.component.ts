import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';
import { UserPharma, userPharmaList } from '../../model/user.model';
import { JobTypeConverterService } from '../../service/job-type-converter.service';
import { UsersService } from '../../service/users.service';
import { UtilService } from '../../service/util.service';
import { toggleAddressChange } from '../../state/actions/address.actions';
import { SetUsersByJobType, updateUsersByJobType } from '../../state/actions/users-actions';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  accuracy!: number;
  _geoLoc: any;
  constructor(private store:Store, private fb:FormBuilder,private route: ActivatedRoute, private converter:JobTypeConverterService, private utilService:UtilService ,private userService:UsersService){}
  type!: string;
  title!: string;
  distance: number = 2
  throttle: number = 50
  paginationIndex:number = 0
  maxIndex: number = 0
  newTitle!: string;
  query: string = ''
  stuff!: string;
  indexName: string = 'pharm-work_user_index'
  emptyResultFlag: boolean = false;
  infiniteScrollingLoadingFlag: boolean = false;
  loadingFlag: boolean = true;
  locationRadiusFlag: boolean = true;
  Users$!: Observable<UserPharma[]>
  newUserFormList!: FormGroup;
  newUserFormUrgent!: FormGroup;
  province$!: Observable<string[]>;
  district$!: Observable<string[]>;
  section$!: Observable<string[]>;
  provinceUrgent$!: Observable<string[]>;
  districtUrgent$!: Observable<string[]>;
  sectionUrgent$!: Observable<string[]>;
  ngOnInit(){
    this.loadingFlag = true;
    this.type = this.route.snapshot.queryParamMap.get('type')!;
    this.title = this.converter.getTitleFromCategorySymbol(this.type);
    this.newTitle = this.converter.getNewTitleFromCategorySymbol(this.type);
    this.userService.getPharmaUserByJobType(this.title, this.paginationIndex).then((users)=>{
      this.query = users.query
      this.maxIndex = users.totalPage
      this.paginationIndex++
      this.store.dispatch(SetUsersByJobType({users:users.result, jobType:this.type}))
      this.loadingFlag = false;
    })
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
      this.initializeFormGroupUrgent();
    }else{
      this.initializeFormGroup();
    }

    this.provinceUrgent$ = this.store.select((state: any)=>{
      let result = Object.keys(state.address.list);
      return result
    })
    this.provinceUrgent$.subscribe(()=>{})
    this.districtUrgent$ = this.store.select((state: any)=>{
      if(this.newUserFormUrgent.value.preferredLocation.Province === '' || this.newUserFormUrgent.value.preferredLocation.Province === null){
        return [];
      }
      return Object.keys(state.address.list[this.newUserFormUrgent.value.preferredLocation.Province])
    })
    this.districtUrgent$.subscribe(()=>{})
    this.sectionUrgent$ = this.store.select((state: any)=>{
      if(this.newUserFormUrgent.value.preferredLocation.District === '' || this.newUserFormUrgent.value.preferredLocation.District === null){
        return [];
      }
      let section: string[] = state.address.list[this.newUserFormUrgent.value.preferredLocation.Province][this.newUserFormUrgent.value.preferredLocation.District].map((section: any)=>section.section);
      return section
    })
    this.sectionUrgent$.subscribe(()=>{})

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

    this.scrollUp();
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
  onScroll() {
    if(this.paginationIndex < this.maxIndex){
      this.infiniteScrollingLoadingFlag = true
      this.userService.paginateJobTypeResult(this.newUserFormUrgent,this.type, this.paginationIndex, this.query, this.indexName).then((user)=>{
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
    this.userService.searchPharmaUsersByPreferredJobType(this.newUserFormList.value, this.type).then((users)=>{
      this.maxIndex = users.totalPage
      this.paginationIndex = 1
      this.query = users.query
      this.indexName = users.indexName
      this.reset();
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
  resetUrgent(){
    this.initializeFormGroupUrgent();
    this.store.dispatch(toggleAddressChange())
  }

  reset(){
    this.initializeFormGroup();
    this.store.dispatch(toggleAddressChange())
  }
  searchUsersUrgent(){
    console.log(this.newUserFormUrgent.value)
      this.newUserFormUrgent.patchValue({_geoloc:this._geoLoc})
    this.loadingFlag = true
    this.userService.searchPharmaUsersUrgentByPreferredJobType(this.newUserFormUrgent.value).then((users)=>{
      this.maxIndex = users.totalPage
      this.paginationIndex = 1
      this.query = users.query
      this.indexName = users.indexName
      this.resetUrgent();
      this.store.dispatch(SetUsersByJobType({users:users.results, jobType:this.type}))
      this.loadingFlag = false
    });
  }
}

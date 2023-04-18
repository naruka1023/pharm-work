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
import { SetUsersByJobType } from '../../state/actions/users-actions';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  constructor(private store:Store, private fb:FormBuilder,private route: ActivatedRoute, private converter:JobTypeConverterService, private utilService:UtilService ,private userService:UsersService){}
  type!: string;
  title!: string;
  newTitle!: string;
  stuff!: string;
  loadingFlag: boolean = true;
  locationRadiusFlag: boolean = true;
  Users$!: Observable<UserPharma[]>
  newUserFormList!: FormGroup;
  province$!: Observable<string[]>;
  district$!: Observable<string[]>;
  section$!: Observable<string[]>;
  ngOnInit(){
    this.loadingFlag = true;
    this.type = this.route.snapshot.queryParamMap.get('type')!;
    this.title = this.converter.getTitleFromCategorySymbol(this.type);
    this.newTitle = this.converter.getNewTitleFromCategorySymbol(this.type);
    this.Users$ = this.store.select((state:any)=>{
      return state.users.users[this.type].long;
    }).pipe(
      map((users:userPharmaList)=>{
        return this.utilService.convertUserPharmaListToArray(users);
      })
    )
    this.Users$.subscribe((users)=>{
      if(users.length == 0){
        this.userService.getPharmaUserByJobType(this.title).subscribe((users: any)=>{
          this.store.dispatch(SetUsersByJobType({users:users, jobType:this.type}))
          this.loadingFlag = false;
        })
      }else{
        this.loadingFlag = false;
      }
    })
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
    this.initializeFormGroup();
    this.scrollUp();
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
    this.userService.searchPharmaUsers(this.newUserFormList.value).subscribe((users)=>{
      let newUser: UserPharma[] = users.docs.map((user)=>{
        let parsedUser =  user.data() as UserPharma;
        parsedUser.uid = user.id
        return parsedUser 
      });
      this.store.dispatch(SetUsersByJobType({users:newUser, jobType:this.type}))
      this.loadingFlag = false;
      this.reset();
    })
  }
  initializeFormGroup(){
    this.newUserFormList = this.fb.group({
      TimeFrame: [''],
      WorkExperience: [''],
      preferredLocation: this.fb.group({
        Section: [''],
        District: [''],
        Province: [''],
      }),
      preferredStartTime: [''],
      preferredJobType: this.title,
      AmountCompleted: ['']
    })
  }
  reset(){
    this.initializeFormGroup();
    this.store.dispatch(toggleAddressChange())
  }
}

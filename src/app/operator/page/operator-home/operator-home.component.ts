import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { JobTypeConverterService } from 'src/app/pharmacist/service/job-type-converter.service';
import SwiperCore, { Autoplay, Mousewheel, Navigation, Pagination } from "swiper";
import { UserPharma } from '../../model/user.model';
import { UsersService } from '../../service/users.service';
import { UtilService } from '../../service/util.service';
import { toggleAddressChange } from '../../state/actions/address.actions';
import { funnelUsers, toggleLoading } from '../../state/actions/users-actions';

SwiperCore.use([Navigation, Pagination, Autoplay, Mousewheel]);

@Component({
  selector: 'app-operator-home',
  templateUrl: './operator-home.component.html',
  styleUrls: ['./operator-home.component.css']
})
export class OperatorHomeComponent {

  constructor(private converter: JobTypeConverterService,private store: Store, private fb:FormBuilder, private userService:UsersService){}

  userJobType$!: Observable<string>;
  loadingUsers$!: Observable<boolean>;
  loadingFlag:boolean = true;
  newUserForm!: FormGroup;
  province$!: Observable<string[]>;
  district$!: Observable<string[]>;
  section$!: Observable<string[]>;
  mapData : any = this.converter.getPlaceHolderObject();
  ngOnInit(){
    this.loadingUsers$ = this.store.select((state:any)=>{
      return state.users.loading
    });
    this.userJobType$ = this.store.select((state:any)=>{
      return state.user.jobType
    });
    this.loadingUsers$.subscribe((loading)=>{
      if(loading){
        this.userService.getAllPharmaUsers().subscribe((users)=>{
          let newUser: UserPharma[] = users.docs.map((user)=> {
            return {
              ...user.data() as UserPharma,
              uid:user.id
            }
          });
          this.store.dispatch(funnelUsers({users: newUser}));
        })
      }else{
        this.loadingFlag = false
      }
    })
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
    this.initializeFormGroup();
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
  initializeFormGroup(){
    this.newUserForm = this.fb.group({
      TimeFrame: [''],
      WorkExperience: [''],
      preferredLocation: this.fb.group({
        Section: [''],
        District: [''],
        Province: [''],
      }),
    })
  }
  reset(){
    this.initializeFormGroup();
    this.store.dispatch(toggleAddressChange())
  }
  searchUsers(){
    this.loadingFlag = true;
    this.userService.searchPharmaUsers(this.newUserForm.value).subscribe((users)=>{
      let newUser: UserPharma[] = users.docs.map((user)=>{
        let parsedUser: UserPharma =  user.data() as UserPharma;
        parsedUser.uid = user.id;
        return parsedUser });
        this.store.dispatch(funnelUsers({users:newUser}))
        this.loadingFlag = false;
      this.reset();
    })
  }
  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }
}

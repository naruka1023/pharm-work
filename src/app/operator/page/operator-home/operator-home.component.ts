import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import SwiperCore, { Autoplay, Mousewheel, Navigation, Pagination } from "swiper";
import { toggleAddressChange } from '../../state/actions/address.actions';

SwiperCore.use([Navigation, Pagination, Autoplay, Mousewheel]);

@Component({
  selector: 'app-operator-home',
  templateUrl: './operator-home.component.html',
  styleUrls: ['./operator-home.component.css']
})
export class OperatorHomeComponent {

  constructor(private store: Store, private fb:FormBuilder){}

  userJobType$!: Observable<string>;
  loading$!: Observable<boolean>;
  newUserForm!: FormGroup;
  province$!: Observable<string[]>;
  district$!: Observable<string[]>;
  section$!: Observable<string[]>;
  ngOnInit(){
    this.loading$ = this.store.select((state:any)=>{
      return state.user.loading
    })
    this.userJobType$ = this.store.select((state:any)=>{
      return state.user.jobType
    })
    this.province$ = this.store.select((state: any)=>{
      let result = Object.keys(state.address.list);
      return result
    })
    this.district$ = this.store.select((state: any)=>{
      if(this.newUserForm.value.Location.Province === ''){
        return [];
      }
      return Object.keys(state.address.list[this.newUserForm.value.Location.Province])
    })
    this.section$ = this.store.select((state: any)=>{
      if(this.newUserForm.value.Location.District === ''){
        return [];
      }
      let section: string[] = state.address.list[this.newUserForm.value.Location.Province][this.newUserForm.value.Location.District].map((section: any)=>section.section);
      return section
    })
    this.initializeFormGroup();
  }
  provinceSelected($event:any){
    this.newUserForm.patchValue({
      Location:{
        ...this.newUserForm.value.Location,
        District:'',
        Section:'',
      }
    })
    this.store.dispatch(toggleAddressChange())
  }
  districtSelected($event:any){
    this.newUserForm.patchValue({
      Location:{
        ...this.newUserForm.value.Location,
        Section:'',
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
      Location: this.fb.group({
        Section: [''],
        District: [''],
        Province: [''],
      }),
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

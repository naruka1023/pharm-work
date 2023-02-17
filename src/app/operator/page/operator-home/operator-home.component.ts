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
  ngOnInit(){
    this.loading$ = this.store.select((state:any)=>{
      return state.user.loading
    })
    this.userJobType$ = this.store.select((state:any)=>{
      return state.user.jobType
    })
    this.initializeFormGroup();
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

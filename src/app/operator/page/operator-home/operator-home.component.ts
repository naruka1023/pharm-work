import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { JobTypeConverterService } from 'src/app/pharmacist/service/job-type-converter.service';
import SwiperCore, { Autoplay, Mousewheel, Navigation, Pagination } from "swiper";
import { UserPharma } from '../../model/user.model';
import { UsersService } from '../../service/users.service';
import { funnelUsers } from '../../state/actions/users-actions';

SwiperCore.use([Navigation, Pagination, Autoplay, Mousewheel]);

@Component({
  selector: 'app-operator-home',
  templateUrl: './operator-home.component.html',
  styleUrls: ['./operator-home.component.css']
})
export class OperatorHomeComponent {

  constructor(private converter: JobTypeConverterService,private store: Store, private fb:FormBuilder, private userService:UsersService){}

  userJobType$!: Observable<string>;
  loading$!: Observable<boolean>;
  loadingUsers$!: Observable<boolean>;
  newUserForm!: FormGroup;
  mapData : any = this.converter.getPlaceHolderObject();
  ngOnInit(){
    this.loading$ = this.store.select((state:any)=>{
      return state.user.loading
    });
    this.loadingUsers$ = this.store.select((state:any)=>{
      return state.users.loading
    });
    this.userJobType$ = this.store.select((state:any)=>{
      return state.user.jobType
    });
    this.loadingUsers$.subscribe((loading)=>{
      if(loading){
        this.userService.getAllPharmaUsers().subscribe((users: UserPharma[])=>{
          this.store.dispatch(funnelUsers({users: users}));
        })
      }
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

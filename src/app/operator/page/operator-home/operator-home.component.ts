import { Component, OnDestroy, inject } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { userOperator } from 'src/app/pharmacist/model/typescriptModel/jobPost.model';

SwiperCore.use([Navigation, Pagination, Autoplay, Mousewheel]);

@Component({
  selector: 'app-operator-home',
  templateUrl: './operator-home.component.html',
  styleUrls: ['./operator-home.component.css']
})
export class OperatorHomeComponent {

  ngOnInit(){
   
  }
}
  
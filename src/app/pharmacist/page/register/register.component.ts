import { Component, ViewChild } from '@angular/core';
import { SwiperComponent } from "swiper/angular";
import SwiperCore, { Virtual } from 'swiper';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Validation from 'src/app/utils/validation';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { UserServiceService } from '../../service/user-service.service';
import { registerFormOperator } from '../../model/typescriptModel/users.model';
import { Observable } from 'rxjs';
import { toggleAddressChange } from '../../state/actions/address.actions';
SwiperCore.use([Virtual]);

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private store:Store, private route: Router, private fb: FormBuilder, private auth:AngularFireAuth,  private db: AngularFirestore){}
  loginFlag: boolean = true;
  loadingFlag: boolean = false;
  registerFormPharmacist!:FormGroup;
  registerFormOperator!:FormGroup;
  role: string = 'เภสัชกร';
  errorMessage: string = '';
  submitted:boolean = false;
  pharmaForm:boolean = true;
  province$!: Observable<string[]>;
  district$!: Observable<string[]>;
  section$!: Observable<string[]>;
  
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  @ViewChild('swiperFormPharma', { static: false }) swiperFormPharma?: SwiperComponent;

  ngOnInit(){
    this.initializeFormGroup()
    this.province$ = this.store.select((state: any)=>{
      let result = Object.keys(state.address.list);
      return result
    })
    this.district$ = this.store.select((state: any)=>{
      if(this.registerFormPharmacist.value.preferredLocation.Province === ''){
        return [];
      }
      return Object.keys(state.address.list[this.registerFormPharmacist.value.preferredLocation.Province])
    })
    this.section$ = this.store.select((state: any)=>{
      if(this.registerFormPharmacist.value.preferredLocation.District === ''){
        return [];
      }
      let section: string[] = state.address.list[this.registerFormPharmacist.value.preferredLocation.Province][this.registerFormPharmacist.value.preferredLocation.District].map((section: any)=>section.section);
      return section
    })
  }

  initializeFormGroup(){
    this.registerFormPharmacist = this.fb.group({
      email: ['fdsa', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      license: ['', [Validators.required]],
      preferredJobType: this.fb.group({
        AB: [false],
        AC: [false],
        BB: [false],
        BC: [false],
        CA: [false]
      }),
      preferredTimeFrame: [''],
      preferredLocation: this.fb.group({
        Section: [''],
        District: [''],
        Province: [''], 
      }),
      preferredStartTime: [''],
      preferredSalary: [''],
    },
    {
      validators: [Validation.match('password', 'confirmPassword')]
    });
    this.registerFormOperator = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      companyName: ['', [Validators.required]],
      jobType: ['', [Validators.required]],
      companyID: ['', [Validators.required]],
      nameOfPerson: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
    },
    {
      validators: [Validation.match('password', 'confirmPassword')]
    });
  }

  provinceSelected(){
    this.registerFormPharmacist.patchValue({
      Location:{
        ...this.registerFormPharmacist.value.Location,
        District:'',
        Section:''
      }
    })
    this.store.dispatch(toggleAddressChange())
  }
  districtSelected(){
    this.registerFormPharmacist.patchValue({
      Location:{
        ...this.registerFormPharmacist.value.Location,
        Section:''
      }
    })
    this.store.dispatch(toggleAddressChange())
  }
  sectionSelected(){
    this.store.dispatch(toggleAddressChange())
  }
  get fP(): { [key: string]: AbstractControl } {
    return this.registerFormPharmacist.controls;
  }
  get fO(): { [key: string]: AbstractControl } {
    return this.registerFormOperator.controls;
  }
  nextSlide(){
    this.pharmaForm? this.swiperFormPharma?.swiperRef.slideNext() : this.swiperFormPharma?.swiperRef.slidePrev() 
    this.pharmaForm = !this.pharmaForm;
  }
  async onSubmit(){
    this.submitted = true;
    let newUser: any;
    if (this.role === 'เภสัชกร') {
      if(this.registerFormPharmacist.invalid ){
        return;
      }else{
        this.loadingFlag = true;
        newUser = this.registerFormPharmacist.value;
        newUser['role'] = 'เภสัชกร';
        newUser['showProfileFlag'] = true;
      }
    }else{
      if (this.registerFormOperator.invalid) {
        return;
      }else{
        this.loadingFlag = true;
        newUser = this.registerFormOperator.value;
        newUser['role'] = 'ผู้ประกอบการ'
      }
    }
    this.auth.createUserWithEmailAndPassword(newUser.email, newUser.password as string)
    .then((user: any)=>{
        delete newUser.password
        delete newUser.confirmPassword
        delete newUser.showProfileFlag
        this.db.collection("users").doc(user.user?.multiFactor.user.uid).set(newUser)
        .then((value)=>{
          this.loadingFlag = false;
          this.route.navigate([''])
        });
      }).catch((error)=>{
          this.loadingFlag = false;
          const code = error.code;
          switch(code){
            case 'auth/weak-password':
              this.errorMessage = 'Password needs to be at least 6 characters long';
              break;
            case 'auth/email-already-in-use':
              this.errorMessage = 'Email already exists';
              break;
          }
        });
  }
  changeRoles(){
    this.errorMessage = '';
    this.submitted = false;
    this.initializeFormGroup();
    this.registerFormOperator.patchValue({jobType:'ร้านยาทั่วไป'})
    this.loginFlag? this.swiper?.swiperRef.slideNext() : this.swiper?.swiperRef.slidePrev() 
    this.role = this.loginFlag? 'ผู้ประกอบการ' : 'เภสัชกร';
    this.loginFlag = !this.loginFlag;
  }
}

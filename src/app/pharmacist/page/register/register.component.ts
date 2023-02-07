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
SwiperCore.use([Virtual]);

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor( private route: Router, private fb: FormBuilder, private auth:AngularFireAuth,  private db: AngularFirestore){}
  loginFlag: boolean = true;
  loadingFlag: boolean = false;
  registerFormPharmacist!:FormGroup;
  registerFormOperator!:FormGroup;
  role: string = 'เภสัชกร';
  errorMessage: string = '';
  submitted:boolean = false;
  
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  ngOnInit(){
    this.registerFormPharmacist = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      license: ['', [Validators.required]],
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
    this.registerFormOperator.reset()
    this.registerFormPharmacist.reset()
  }
  get fP(): { [key: string]: AbstractControl } {
    return this.registerFormPharmacist.controls;
  }
  get fO(): { [key: string]: AbstractControl } {
    return this.registerFormOperator.controls;
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
        newUser['showProfileFlag'] = false;
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
        console.log(user.user?.multiFactor.user.uid);
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
    this.registerFormOperator.reset()
    this.registerFormPharmacist.reset()
    this.registerFormOperator.patchValue({jobType:'ร้านยาทั่วไป'})
    this.loginFlag? this.swiper?.swiperRef.slideNext() : this.swiper?.swiperRef.slidePrev() 
    this.role = this.loginFlag? 'ผู้ประกอบการ' : 'เภสัชกร';
    this.loginFlag = !this.loginFlag;
  }
}

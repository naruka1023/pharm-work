import { Component, ViewChild, inject } from '@angular/core';
import { SwiperComponent } from "swiper/angular";
import SwiperCore, { Virtual } from 'swiper';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Validation from 'src/app/utils/validation';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { JobTypeConverterService } from '../../service/job-type-converter.service';
import { UtilService } from '../../service/util.service';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
SwiperCore.use([Virtual]);

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private converter:JobTypeConverterService,private utilService:UtilService,private store:Store, private route: Router, private fb: FormBuilder){}
  private auth: Auth = inject(Auth)
  private db: Firestore = inject(Firestore)
  loginFlag: boolean = true;
  loadingFlag: boolean = false;
  registerFormPharmacist!:FormGroup;
  registerFormOperator!:FormGroup;
  role: string = 'เภสัชกร';
  errorMessage: string = '';
  submitted:boolean = false;
  storage = getStorage();
  pharmaForm:boolean = true;
  
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  @ViewChild('swiperFormPharma', { static: false }) swiperFormPharma?: SwiperComponent;

  ngOnInit(){
    this.initializeFormGroup()
  }

  initializeFormGroup(){
    this.registerFormPharmacist = this.fb.group({
      email: ['fdsa', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required]],
      nickName: [''],
      surname: ['', [Validators.required]],
      license: ['', [Validators.required]],
      preferredJobType: this.fb.group({
        S: [false],
        AA: [false],
        AB: [false],
        AC: [false],
        BA: [false],
        BB: [false],
        BC: [false],
        CA: [false],
        CB: [false],
      }),
      showProfileFlag: true,
      preferredTimeFrame: [''],
      preferredLocation: this.fb.group({
        Section: [''],
        District: [''],
        Province: [''], 
      }),
      preferredStartTime: [''],
      dateUpdated: new Date().toISOString().split('T')[0],
      preferredSalary: [''],
      WorkExperience: 0,
      AmountCompleted: 0
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
        newUser = this.utilService.populateObjectWithLocationFields(newUser);
        newUser['role'] = 'เภสัชกร';
        newUser['showProfileFlag'] = true;
      }
      newUser.preferredJobType = this.converter.objectToArray(newUser.preferredJobType);
    }else{
      if (this.registerFormOperator.invalid) {
        return;
      }else{
        this.loadingFlag = true;
        newUser = this.registerFormOperator.value;
        newUser['role'] = 'ผู้ประกอบการ'
      }
    }
    createUserWithEmailAndPassword(this.auth, newUser.email, newUser.password as string)
    .then((user: any)=>{
        delete newUser.password
        delete newUser.confirmPassword
        newUser.uid = user.user?.multiFactor.user.uid;

        let promises: Promise<any>[] = [];
        promises.push(getDownloadURL(ref(this.storage, 'placeholder/profile-picture')))
        promises.push(getDownloadURL(ref(this.storage, 'placeholder/cover-photo')))
        Promise.all(promises).then((e:any)=>{
          e.forEach((some: string)=>{
            if(some.indexOf('profile-picture') !== -1){
              newUser.profilePictureUrl = some
            }else{
              newUser.coverPhotoPictureUrl = some
            }
          })
          setDoc(doc(this.db, 'users', user.user?.multiFactor.user.uid), newUser)
          .then((value)=>{
            this.loadingFlag = false;
            this.route.navigate([newUser.role == 'ผู้ประกอบการ'?'operator':'pharma'])
          });
          })
        })
        .catch((error)=>{
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

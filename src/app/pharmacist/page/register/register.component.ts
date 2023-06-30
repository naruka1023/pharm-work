import { Component, ViewChild, inject, AfterViewInit } from '@angular/core';
import { SwiperComponent } from "swiper/angular";
import SwiperCore, { Virtual } from 'swiper';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Validation from 'src/app/utils/validation';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { JobTypeConverterService } from '../../service/job-type-converter.service';
import { UtilService } from '../../service/util.service';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Auth, createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateCurrentUser, updateProfile } from '@angular/fire/auth';
import { Firestore, doc, setDoc} from '@angular/fire/firestore';
SwiperCore.use([Virtual]);

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements AfterViewInit {
  constructor(private converter:JobTypeConverterService,private utilService:UtilService,private store:Store, private route: ActivatedRoute, private fb: FormBuilder){}
  private auth: Auth = inject(Auth)
  private db: Firestore = inject(Firestore)
  loginFlag: boolean = true;
  loadingFlag: boolean = false;
  isPharma: boolean = true
  registerFormPharmacist!:FormGroup;
  registerFormOperator!:FormGroup;
  role: string = 'เภสัชกร';
  errorMessage: string = '';
  submitted:boolean = false;
  storage = getStorage();
  header: string = 'ลงทะเบียน'
  pharmaForm:boolean = true;
  
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  @ViewChild('swiperFormPharma', { static: false }) swiperFormPharma?: SwiperComponent;

  ngOnInit(){
    this.initializeFormGroup()
  }
  
  ngAfterViewInit(){
    if(this.route.snapshot.queryParamMap.get('isPharma') !== null){
      this.isPharma = this.route.snapshot.queryParamMap.get('isPharma') == 'true'? true:false
    }
    if(!this.isPharma){
      this.changeRoles('operator')
      document.getElementById('urgent-job')?.click()
    }
  }

  initializeFormGroup(){
    this.registerFormPharmacist = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      nickName: [''],
      surname: ['', [Validators.required]],
      license: ['', [Validators.required]],
      Agreement: [false, [Validators.requiredTrue]],
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
      Agreement: ['', [Validators.requiredTrue]]
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
    this.swiperFormPharma?.swiperRef.slideNext()
    let display = 'block'
    const excessForm = document.querySelectorAll('.excessForm');
    this.header = 'งานที่กำลังมองหา'
    excessForm.forEach((eF: any) => {
      eF.style.display = display;
    });
    this.pharmaForm = false;
  }
  backSlide(){
    this.swiperFormPharma?.swiperRef.slidePrev() 
    let display = 'none'
    const excessForm = document.querySelectorAll('.excessForm');
    this.header = 'ลงทะเบียน'
    excessForm.forEach((eF: any) => {
      eF.style.display = display;
    });
    this.pharmaForm = true;
  }
  async onSubmit(){
    this.submitted = true;
    let newUser: any;
    if (this.role === 'เภสัชกร') {
      if(this.registerFormPharmacist.invalid ){
        this.backSlide()
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
      updateProfile(this.auth.currentUser!,{
        displayName: newUser.role == 'ผู้ประกอบการ'? newUser.nameOfPerson : newUser.name
      }).then(()=>{
        sendEmailVerification(this.auth.currentUser!)
      })
        delete newUser.password
        delete newUser.confirmPassword
        newUser.uid = user.user?.uid;

        let promises: Promise<any>[] = [];
        if(newUser.role == 'เภสัชกร'){
          if(newUser.gender == 'ชาย'){
            promises.push(getDownloadURL(ref(this.storage, 'placeholder/male-pharma-profile.png')))
          }else{            
            promises.push(getDownloadURL(ref(this.storage, 'placeholder/female-pharma-profile.png')))
          }
          promises.push(getDownloadURL(ref(this.storage, 'placeholder/pharma-cover-photo.png')))
        }else{
          promises.push(getDownloadURL(ref(this.storage, 'placeholder/operator-profile.png')))
          promises.push(getDownloadURL(ref(this.storage, 'placeholder/operator-cover-photo.png')))
        }
        Promise.all(promises).then((e:any)=>{
          e.forEach((some: string)=>{
            if(some.indexOf('profile') !== -1){
              newUser.profilePictureUrl = some
            }else{
              newUser.coverPhotoPictureUrl = some
            }
          })
          setDoc(doc(this.db, 'users', user.user.uid), newUser)
          .then((value)=>{
            this.loadingFlag = false;
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
  changeRoles(role: string){
    this.errorMessage = '';
    this.submitted = false;
    if(role !=='pharma'){
      this.swiper?.swiperRef.slideNext() 
      this.backSlide()
    }else{
      this.swiper?.swiperRef.slidePrev() 
    }
    this.role = role !== 'pharma'? 'ผู้ประกอบการ' : 'เภสัชกร';
    if(this.loginFlag){
      this.pharmaForm = true
    }
    this.loginFlag = !this.loginFlag;
  }
}

import { Component, ViewChild, inject, AfterViewInit } from '@angular/core';
import { SwiperComponent } from "swiper/angular";
import SwiperCore, { Virtual } from 'swiper';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Validation from 'src/app/utils/validation';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { JobTypeConverterService } from '../../service/job-type-converter.service';
import { UtilService } from '../../service/util.service';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Auth, createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateCurrentUser, updateProfile } from '@angular/fire/auth';
import { Firestore, doc, setDoc} from '@angular/fire/firestore';
import { atLeastOneCheckboxCheckedValidator } from './require-checkboxes-to-be-checked.validator';
import { UserServiceService } from '../../service/user-service.service';

SwiperCore.use([Virtual]);

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements AfterViewInit {
  constructor(private userService:UserServiceService, private converter:JobTypeConverterService, private utilService:UtilService, private store:Store, private route: ActivatedRoute, private fb: FormBuilder){}
  private auth: Auth = inject(Auth)
  private db: Firestore = inject(Firestore)
  loginFlag: boolean = true;
  loadingFlag: boolean = false;
  isPharma: boolean = true
  registerFormPharmacist!:FormGroup;
  registerFormStudent!:FormGroup;
  registerFormOperator!:FormGroup;
  role: string = 'เภสัชกร';
  errorMessage: string = '';
  submitted:boolean = false;
  storage = getStorage();
  header: string = 'ลงทะเบียน'
  pharmaForm:boolean = true;
  studentForm:boolean = true;
  
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  @ViewChild('swiperFormPharma', { static: false }) swiperFormPharma?: SwiperComponent;
  @ViewChild('swiperFormStudent', { static: false }) swiperFormStudent?: SwiperComponent;

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

  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }

  addEducation(){
    let educationToAdd = this.fb.group({
      universityName: ['', [Validators.required]],
      franchise: [''],
      yearGraduated: [''],
      educationLevel: ['', [Validators.required]],
      major: ['', [Validators.required]]
    });
    let newValue: FormArray = this.registerFormStudent.controls['educationHistory'] as FormArray;
    newValue.push(educationToAdd);
    this.registerFormStudent.controls['educationHistory'].setValue(newValue.value);
  }

  initializeFormGroup(){
    this.registerFormStudent = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      nickName: [''],
      surname: ['', [Validators.required]],
      // license: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      highestEducation: ['', [Validators.required]],
      // Agreement: [false, [Validators.requiredTrue]],
      educationHistory: this.fb.array([]),
      showProfileFlag: true,
      dateUpdated: new Date().toISOString().split('T')[0],
      dateUpdatedUnix: Math.floor(new Date().getTime() / 1000),
      WorkExperience: 0,
      AmountCompleted: 0,
      active: 'อนุญาตให้ดูข้อมูล'
    },
    {
      validators: [Validation.match('password', 'confirmPassword')]
    });
    this.addEducation()
    this.registerFormPharmacist = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      nickName: [''],
      surname: ['', [Validators.required]],
      license: ['' , [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      Agreement: [false, [Validators.requiredTrue]],
      preferredJobType: new FormGroup({
        S: new FormControl(false),
        AA: new FormControl(false),
        AB: new FormControl(false),
        AC: new FormControl(false),
        BA: new FormControl(false),
        BB: new FormControl(false),
        BC: new FormControl(false),
        CA: new FormControl(false),
        CB: new FormControl(false),
      }, atLeastOneCheckboxCheckedValidator()),
      showProfileFlag: true,
      preferredTimeFrame: ['Full-Time และ Part-Time'],
      preferredLocation: this.fb.group({
        Section: [''],
        District: [''],
        Province: [''], 
      }),
      preferredStartTime: [''],
      dateUpdated: new Date().toISOString().split('T')[0],
      dateUpdatedUnix: Math.floor(new Date().getTime() / 1000),
      preferredSalary: [''],
      WorkExperience: 0,
      AmountCompleted: 0,
      active: 'อนุญาตให้ดูข้อมูล'
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
      companyID: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
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
  get fS(): { [key: string]: AbstractControl } {
    return this.registerFormStudent.controls;
  }
  get fO(): { [key: string]: AbstractControl } {
    return this.registerFormOperator.controls;
  }
  get FormEduData(): any{
    let entity = this.registerFormStudent.get('educationHistory') as FormArray;
    return entity.controls;
  }
  nextSlideStudent(){
    this.swiperFormStudent?.swiperRef.slideNext()
    const display = 'none'
    const excessForm = document.querySelectorAll('.excessFormStudent');
    this.header = 'ประวัติการศึกษา'
    excessForm.forEach((eF: any) => {
      eF.style.display = display;
    });
    this.studentForm = false;
  }
  backSlideStudent(){
    this.swiperFormStudent?.swiperRef.slidePrev() 
    const display = 'block'
    const excessForm = document.querySelectorAll('.excessFormStudent');
    this.header = 'ลงทะเบียน'
    excessForm.forEach((eF: any) => {
      eF.style.display = display;
    });
    this.studentForm = true;
  }
  nextSlide(){
    this.swiperFormPharma?.swiperRef.slideNext()
    const display = 'block'
    const excessForm = document.querySelectorAll('.excessForm');
    this.header = 'งานที่กำลังมองหา'
    excessForm.forEach((eF: any) => {
      eF.style.display = display;
    });
    this.pharmaForm = false;
  }
  backSlide(){
    this.swiperFormPharma?.swiperRef.slidePrev() 
    const display = 'none'
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
    switch(this.role){
      case 'เภสัชกร':
        if(this.registerFormPharmacist.invalid ){
          this.backSlide()
          return;
        }else{
          this.loadingFlag = true;
          newUser = this.registerFormPharmacist.value;
          newUser = this.utilService.populateObjectWithLocationFields(newUser);
          newUser['role'] = 'เภสัชกร';
          newUser['showProfileFlag'] = true;
          newUser['studentFlag'] = false
        }
        newUser.preferredJobType = this.converter.objectToArray(newUser.preferredJobType);
        break;
        case 'ผู้ประกอบการ':
          if (this.registerFormOperator.invalid) {
          return;
        }else{
          this.loadingFlag = true;
          newUser = this.registerFormOperator.value;
          newUser['role'] = 'ผู้ประกอบการ'
        }
        break;
      case 'student':
        if(this.registerFormStudent.invalid){
          this.backSlideStudent()
          return;
        }else{
          this.loadingFlag = true;
          newUser = this.registerFormStudent.value;
          newUser['role'] = 'เภสัชกร';
          newUser['studentFlag'] = true;
          newUser['showProfileFlag'] = true;
        }
      break;
    }
    if(this.role !== 'เภสัชกร'){
      this.createAccount(newUser)
    }else{
      this.userService.authenticateLicense(newUser['name'], newUser['surname'], newUser['license']).subscribe((res: any)=>{
        if(res.result){
          this.createAccount(newUser)
        }
        else{
          this.loadingFlag = false
          this.backSlide()
          this.errorMessage = 'ชื่อหรือนามสกุลหรือเลขใบประกอบของท่านไม่ถูกต้องตามฐานข้อมูลรายชื่อผู้ประกอบวิชาชีพเภสัชกรรม'
        }
      })
    }
  }
  createAccount(newUser: any){
    createUserWithEmailAndPassword(this.auth, newUser.email, newUser.password as string)
    .then((user: any)=>{
      updateProfile(this.auth.currentUser!,{
        displayName: newUser.role == 'ผู้ประกอบการ'? newUser.nameOfPerson : newUser.name
      }).then(()=>{
      })
      delete newUser.password
        delete newUser.confirmPassword
        newUser.uid = user.user?.uid;
  
        const promises: Promise<any>[] = [];
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
            sendEmailVerification(this.auth.currentUser!).then(()=>{
              location.reload()
            })
          });
          })
        })
        .catch((error)=>{
          this.loadingFlag = false;
          const code = error.code;
          switch(code){
            case 'auth/weak-password':
              this.errorMessage = 'รหัสผ่านต้องอย่างน้อย 6 ตัวอักษร';
              break;
            case 'auth/email-already-in-use':
              this.errorMessage = 'อีเมลนี้ถูกสมัครใช้งานเรียบร้อยแล้ว';
              break;
          }
        });
    
  }
  changeRoles(role: string){
    this.errorMessage = '';
    this.submitted = false;
    switch(role){
      case 'pharma':
        this.swiper?.swiperRef.slideTo(0) 
        this.role = 'เภสัชกร';
        this.backSlide()
        break;
        case 'operator':
        this.swiper?.swiperRef.slideTo(1) 
        this.role = 'ผู้ประกอบการ';
        this.header = 'ลงทะเบียน'
        break;
        case 'student':
          this.swiper?.swiperRef.slideTo(2) 
          this.role = 'student';
          this.backSlideStudent();
          break;
    }
    if(this.loginFlag){
      this.pharmaForm = true
    }
    this.loginFlag = !this.loginFlag;
  }
}

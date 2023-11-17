import { AfterViewInit, Component, inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import SwiperCore, { Navigation } from 'swiper';
import { Router } from '@angular/router';
import { Auth, sendPasswordResetEmail, signInWithEmailAndPassword } from '@angular/fire/auth';

SwiperCore.use([Navigation]);
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent implements AfterViewInit{
  private auth: Auth = inject(Auth)
  loginFlag:boolean = false;
  modalErrorFlag: boolean = false;
  modalLoadingFlag:boolean = false;
  errorFlag:boolean = false;
  errorMessage: string = 'โปรดใส่อีเมลและรหัสผ่านให้ถูก';
  swiper!: any;
  header: string = 'เภสัช'
  loginForm!:FormGroup;
  email!: FormControl;
  resetSuccessful: boolean = false;
  resetButtonFlag: boolean = true;

  constructor(private route: Router, private fb: FormBuilder){
  }
  ngOnInit(){
    this.loginForm = this.fb.group({
      userName: ['',Validators.required],
      password: ['', Validators.required],
    });
    this.email = new FormControl('', [Validators.required,Validators.email]);
    const myModal = document.getElementById('exampleModal')
    
    myModal?.addEventListener('show.bs.modal', (fds) => {
      this.resetSuccessful = false;
      this.resetButtonFlag = true;
    })
    this.scrollUp();
  }
    
  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }

  changeHeader(isPharma: boolean | string){
    if(isPharma == 'student'){
      this.header = 'นักษึกษาเภสัชกร'
    }else{
      this.header = isPharma? 'เภสัช' : 'ผู้ประกอบการ'
    }
  }

  ngAfterViewInit(): void {
    this.swiper = document.querySelector('.swiper')! ;
  }

  onForgetPassword(){
    this.modalLoadingFlag = true;
    sendPasswordResetEmail(this.auth, this.email.value).then((fd) => {
      this.modalLoadingFlag = false
      this.resetSuccessful = true;
      this.resetButtonFlag = false;
      setTimeout(()=>{document.getElementById('closeButton')?.click()},1500)
    })
    .catch((error) => {
      this.modalErrorFlag = true;
      this.modalLoadingFlag = false
    });
  }

  onSubmit(){
    this.loginFlag = true;
    signInWithEmailAndPassword(this.auth, this.loginForm.value.userName, this.loginForm.value.password)
    .then(() => {
      this.loginFlag = false
      this.route.navigate(['']);
      location.reload()
    })
    .catch((error) => {
      this.loginFlag = false
      this.errorFlag = true;
      const errorCode = error.code;
      switch(errorCode){
        case 'auth/invalid-email':
          this.errorMessage = 'โปรดใส่อีเมลและรหัสผ่านให้ถูกต้อง'
          break;
        case 'auth/wrong-password':
          this.errorMessage = 'รหัสผ่านไม่ถูกต้อง'
          break;
        case 'auth/user-not-found':
          this.errorMessage = 'ไม่พบชื่อผู้ใช้งานดังกล่าว'
          break;
        default:
          break;
      }
      (error.code);
    });
  }
}

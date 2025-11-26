import { AfterViewInit, Component, inject } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  Auth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { FirebaseService } from 'src/app/service/firebase.service';
import { SsrService } from 'src/app/service/ssr.service';
declare let window: any;

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements AfterViewInit {
  mainPageFlag: boolean = true;
  private auth: Auth = this.firebaseService.auth;
  loginFlag: boolean = false;
  modalErrorFlag: boolean = false;
  modalLoadingFlag: boolean = false;
  errorFlag: boolean = false;
  loginImage: string = 'url("assets/pharmaLogin.png")';
  errorMessage: string = 'โปรดใส่อีเมลและรหัสผ่านให้ถูก';
  swiper!: any;
  pharmaFlag: string | boolean = true;
  header: string = 'เข้าสู่ระบบ<span class="green-text">เภสัช</span>';
  loginForm!: FormGroup;
  email!: FormControl;
  loginModal: any;
  resetSuccessful: boolean = false;
  resetButtonFlag: boolean = true;

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private ssrService: SsrService
  ) {}
  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });

    if (this.ssrService.isBrowser()) {
      this.loginModal = new window.bootstrap.Modal(
        document.getElementById('loginModal')
      );
      const myModal = document.getElementById('exampleModal');
      myModal?.addEventListener('show.bs.modal', (fds) => {
        this.resetSuccessful = false;
        this.resetButtonFlag = true;
      });

      this.scrollUp();
    }

    this.email = new FormControl('', [Validators.required, Validators.email]);
  }

  scrollUp() {
    if (this.ssrService.isBrowser()) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'auto',
      });
    }
  }
  closeModal() {
    this.loginModal.hide();
  }
  changeHeader(isPharma: boolean | string) {
    this.mainPageFlag = true;
    this.pharmaFlag = isPharma;
    if (isPharma == 'student') {
      this.header = 'เข้าสู่ระบบ<span class="blue-text">นักศึกเภสัช</span>';
      this.loginImage = 'url("assets/studentLogin.png")';
    } else {
      this.header = isPharma
        ? 'เข้าสู่ระบบ<span class="green-text">เภสัช</span>'
        : 'เข้าสู่ระบบ<span class="purple-text">บริษัท</span>';
      this.loginImage = isPharma
        ? 'url("assets/pharmaLogin.png")'
        : 'url("assets/operatorLogin.png")';
    }
  }

  ngAfterViewInit(): void {
    if (this.ssrService.isBrowser()) {
      this.swiper = document.querySelector('.swiper')!;
    }
  }

  onForgetPassword() {
    this.modalLoadingFlag = true;
    sendPasswordResetEmail(this.auth, this.email.value)
      .then((fd) => {
        this.modalLoadingFlag = false;
        this.resetSuccessful = true;
        this.resetButtonFlag = false;
        setTimeout(() => {
          document.getElementById('closeButton')?.click();
        }, 1500);
      })
      .catch((error) => {
        this.modalErrorFlag = true;
        this.modalLoadingFlag = false;
      });
  }

  forgetPasswordOpen() {
    this.header = 'โปรดใส่อีเมลเพื่อรีเซ็ตรหัสผ่าน';
    this.mainPageFlag = false;
  }

  onSubmit() {
    this.loginFlag = true;
    signInWithEmailAndPassword(
      this.auth,
      this.loginForm.value.userName,
      this.loginForm.value.password
    )
      .then(() => {
        this.loginFlag = false;
        this.route.navigate(['']);
        location.reload();
      })
      .catch((error) => {
        this.loginFlag = false;
        this.errorFlag = true;
        const errorCode = error.code;
        switch (errorCode) {
          case 'auth/invalid-email':
            this.errorMessage = 'โปรดใส่อีเมลและรหัสผ่านให้ถูกต้อง';
            break;
          case 'auth/wrong-password':
            this.errorMessage = 'รหัสผ่านไม่ถูกต้อง';
            break;
          case 'auth/user-not-found':
            this.errorMessage = 'ไม่พบชื่อผู้ใช้งานดังกล่าว';
            break;
          default:
            break;
        }
        error.code;
      });
  }
}

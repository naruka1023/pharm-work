import { AfterViewInit, Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import SwiperCore, { Navigation, Swiper } from 'swiper';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

SwiperCore.use([Navigation]);
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent implements AfterViewInit{
  
  loginFlag:boolean = true;
  swiper!: any;
  loginForm!:FormGroup;

  constructor(private route: Router, private auth: AngularFireAuth, private fb: FormBuilder){

  }
  ngOnInit(){
    this.loginForm = this.fb.group({
      userName: ['',Validators.required],
      password: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.swiper = document.querySelector('.swiper')! ;
  }

  onSubmit(){
    this.auth.signInWithEmailAndPassword(this.loginForm.value.userName, this.loginForm.value.userName)
    .then((userCredential) => {
      this.route.navigate([''])
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });
  }

  changeRoles(){
    this.loginFlag? this.swiper.swiper.slideNext() : this.swiper.swiper.slidePrev() 
    this.loginFlag = !this.loginFlag;
  }
}

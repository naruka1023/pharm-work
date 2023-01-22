import { Component, ViewChild } from '@angular/core';
import { SwiperComponent } from "swiper/angular";
import SwiperCore, { Swiper, Virtual } from 'swiper';
SwiperCore.use([Virtual]);

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  loginFlag: boolean = true;
  role: string = 'เภสัชกร'
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  changeRoles(){
    this.loginFlag? this.swiper?.swiperRef.slideNext() : this.swiper?.swiperRef.slidePrev() 
    this.role = this.loginFlag? 'ผู้ประกอบการ' : 'เภสัชกร';
    this.loginFlag = !this.loginFlag;
  }
}

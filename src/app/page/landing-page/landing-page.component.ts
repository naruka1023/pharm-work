import { Component } from '@angular/core';
import SwiperCore, { Autoplay, Mousewheel, Navigation, Pagination } from "swiper";
SwiperCore.use([Navigation, Pagination, Autoplay, Mousewheel]);
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  headerArray: string[] = ['งานร้านยา Part-time', 'งานร้านยา Full-time',  'งานโรงพยาบาล Part-time', 'งานโรงพยาบาล Full-time', 'โรงงาน', 'บริษัทยา', 'อื่นๆ'];
}

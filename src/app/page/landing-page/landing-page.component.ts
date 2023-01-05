import { Component } from '@angular/core';
import SwiperCore, { Autoplay, Mousewheel, Navigation, Pagination } from "swiper";
SwiperCore.use([Navigation, Pagination, Autoplay, Mousewheel]);
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  headerArray: string[] = ['งานเภสัชด่วนรายวัน',  'งานร้านยาทั่วไป (Stand alone)', 'งานร้านยา Brand (Chain)',  'แนะนำ Brand ร้านยาทั้งหมด ', 'งานโรงพยาบาล', 'งานโรงงาน', 'งานบริษัทยา', 'แนะนำโรงงานและบริษัทยาทั้งหมด'];
}

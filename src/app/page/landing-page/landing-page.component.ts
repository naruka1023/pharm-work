import { Component } from '@angular/core';
import { filterConditions } from 'src/app/model/filter-conditions/filter-conditions';
import SwiperCore, { Autoplay, Mousewheel, Navigation, Pagination } from "swiper";

SwiperCore.use([Navigation, Pagination, Autoplay, Mousewheel]);

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  headerArray: filterConditions [] = [
    { 
      header: 'งานเภสัชด่วนรายวัน',
      filterFlag: true,
      dateFilter: true,
      JobType: false,
      timeFrame: false,
      location: true,
      categorySymbol:"AA"
    },  
    { 
      header: 'งานร้านยาทั่วไป (Stand alone)',
      filterFlag: true,
      dateFilter: false,
      JobType: false,
      timeFrame: true,
      location: true,
      brandToCategory:"แนะนำร้านยาใกล้คุณ",
      categorySymbol:"AB"
    }, 
    { 
      header: 'งานร้านยา Brand (Chain)',
      filterFlag: true,
      dateFilter: false,
      JobType: false,
      timeFrame: true,
      location: true,
      brandToCategory: "แนะนำร้านยาแบรน์ทั้งหมด",
      categorySymbol:"AC"
    },  
    { 
      header: 'แนะนำ Brand ร้านยาทั้งหมด ',
      filterFlag: false,
      dateFilter: false,
      JobType: false,
      timeFrame: false,
      location: false,
      categorySymbol:"BA"
    }, 
    { 
      header: 'งานโรงพยาบาล/งานคลินิก',
      filterFlag: true,
      dateFilter: false,
      JobType: true,
      timeFrame: true,
      location: true,
      brandToCategory: 'แนะนำโรงพยาบาลและคลินิกใกล้คุณ',
      categorySymbol:"BB"
    }, 
    { 
      header: 'งานโรงงาน/งานบริษัท/งาวิจัย',
      filterFlag: true,
      dateFilter: true,
      JobType: false,
      JobTypeTwo: true,
      timeFrame: false,
      brandToCategory: ' แนะนำโรงงานและบริษัททั้งหมด',
      location: true,
      categorySymbol:"BC"
    },
    { 
      header: 'งานอื่นๆ',
      filterFlag: true,
      dateFilter: false,
      JobType: false,
      timeFrame: true,
      location: true,
      categorySymbol:"CA"
    }, 
    { 
      header: 'แนะนำโรงงานและบริษัทยาทั้งหมด',
      filterFlag: false,
      dateFilter: false,
      JobType: false,
      timeFrame: false,
      location: false,
      categorySymbol:"CB"
    }
  ];
  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }
}

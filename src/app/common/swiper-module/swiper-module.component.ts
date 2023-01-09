import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { filterConditions } from 'src/app/model/filter-conditions/filter-conditions';
@Component({
  selector: 'app-swiper-module',
  templateUrl: './swiper-module.component.html',
  styleUrls: ['./swiper-module.component.css']
})
export class SwiperModuleComponent {
  @Input()filterFlags!: filterConditions;
  filterVisibleFlag: boolean = false;
  
  constructor(private router: Router){
    
  }

  toggleFilter(){
    this.filterVisibleFlag = !this.filterVisibleFlag
  }

  goToList(){
    const dsa = {id: 1};
    this.router.navigate(['jobs-list'],{queryParams: {header: this.filterFlags.header}})
  }
}

import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { filterConditions } from 'src/app/model/filter-conditions/filter-conditions';
@Component({
  selector: 'app-swiper-module',
  templateUrl: './swiper-module.component.html',
  styleUrls: ['./swiper-module.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SwiperModuleComponent {
  @Input()filterFlags!: filterConditions;
  filterVisibleFlag: boolean = false;
  urgentFlag: boolean = false;
  collapseButton!: string
  
  constructor(private router: Router){
    
  }

  ngOnInit(){
    this.collapseButton = "#" + this.filterFlags.categorySymbol;
    if(this.filterFlags.header === 'งานเภสัชด่วนรายวัน'){
      this.urgentFlag = true;
    }
  }

  toggleFilter(){
    this.filterVisibleFlag = !this.filterVisibleFlag
  }

  goToList(){
    const dsa = {id: 1};
    const brandToCategory = this.filterFlags.brandToCategory !== undefined? this.filterFlags.brandToCategory : '';
    this.router.navigate(['jobs-list'],
    {
      queryParams: 
      {
        header: this.filterFlags.header,
        brandToCategory: brandToCategory
      }
    })
  }
}

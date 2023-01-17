import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { filterConditions } from 'src/app/model/typescriptModel/job-post-model/jobPost.model';
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
    this.collapseButton = "#" + this.filterFlags.CategorySymbol;
    if(this.filterFlags.header === 'งานเภสัชด่วนรายวัน'){
      this.urgentFlag = true;
    }
  }

  toggleFilter(){
    this.filterVisibleFlag = !this.filterVisibleFlag
  }

  goToList(){
    this.router.navigate(['jobs-list'],
    {
      queryParams: 
      {
        CategorySymbol: this.filterFlags.CategorySymbol,
      }
    })
  }
}

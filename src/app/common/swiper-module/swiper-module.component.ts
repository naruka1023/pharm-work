import { Component, Input, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { filterConditions } from 'src/app/model/typescriptModel/jobPost.model';
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
  
  constructor(private router: Router, private auth: AngularFireAuth){
    
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
    this.auth.user.subscribe((user) =>{
      if(user){
        this.router.navigate(['jobs-list'],
        {
          queryParams: 
          {
            CategorySymbol: this.filterFlags.CategorySymbol,
          }
        })
      }else{
        this.router.navigate(['login'])
      }
    })
    
  }
}

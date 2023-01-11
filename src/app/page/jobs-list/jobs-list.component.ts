import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import SwiperCore, { Grid, Navigation, Pagination } from "swiper";
declare var bootstrap: any;
SwiperCore.use([Grid, Pagination, Navigation]);



@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.css'],
})
export class JobsListComponent {
  header!: string
  brandToCategory!: string
  constructor(private route: ActivatedRoute){
  }

  ngOnInit(){
    this.header = this.route.snapshot.queryParamMap.get('header')!;
    this.brandToCategory = this.route.snapshot.queryParamMap.get('brandToCategory')!;
  }

}

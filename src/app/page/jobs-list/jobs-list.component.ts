import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filterConditions, jobPostModel } from 'src/app/model/typescriptModel/job-post-model/jobPost.model';
import { getJobCategory } from 'src/app/state/actions/job-post.actions';
import SwiperCore, { Grid, Navigation, Pagination } from "swiper";
SwiperCore.use([Grid, Pagination, Navigation]);



@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.css'],
})
export class JobsListComponent {
  CategorySymbol!: string;
  header!: string;
  brandToCategory!: string;
  content$!: Observable<jobPostModel[] | undefined>;
  loading$!: Observable<boolean>;
  
  constructor(private route: ActivatedRoute, private store: Store, private router: Router){
  }
  
  ngOnInit(){
    this.loading$ = this.store.select((state: any)=>
    state.jobpost.loading);
    this.loading$.subscribe((res)=>{
      if(res){
        this.router.navigate([''])
      }
    })
    this.CategorySymbol = this.route.snapshot.queryParamMap.get('CategorySymbol')!;
    this.store.dispatch(getJobCategory({CategorySymbol: this.CategorySymbol}));
    this.content$ = this.store.select((state: any) =>{
      const jobList : filterConditions =  state.jobpost.JobPost.find((res: any)=>{
        return res.CategorySymbol == this.CategorySymbol
      });
      this.header = jobList.header;
      this.brandToCategory = (jobList.brandToCategory !== undefined)? jobList.brandToCategory : '';
      return jobList.allContent
    });
  }
}

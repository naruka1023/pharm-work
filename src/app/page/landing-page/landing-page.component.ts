import { Component } from '@angular/core';
import SwiperCore, { Autoplay, Mousewheel, Navigation, Pagination } from "swiper";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { JobPostService } from 'src/app/service/job-post.service';
import { filterConditions, jobPostModel } from 'src/app/model/typescriptModel/jobPost.model';
import { Store } from '@ngrx/store';
import { getJobs } from 'src/app/state/actions/job-post.actions';
// import { selectJobPost, selectLoading } from 'src/app/state/selectors/job-post.selectors';

SwiperCore.use([Navigation, Pagination, Autoplay, Mousewheel]);

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {

  loadingFlag$!: Observable<boolean>;

  items$!: Observable<filterConditions[]>;
  constructor(private store: Store, private db: AngularFirestore){
  }
  
  ngOnInit(){
  
    this.loadingFlag$ = this.store.select((state: any)=>
    state.jobpost.loading);
    this.loadingFlag$.subscribe((flag)=>{
      if(flag){
        this.dispatchJobs();
      }
    })
    this.items$ = this.store.select((state: any)=>{
      let content: filterConditions[] = []
      for (const [key, value] of Object.entries(state.jobpost.JobPost)) {
        content.push(value as filterConditions);
      }
      return content
  });
  }
  
  dispatchJobs() {
    this.store.dispatch(getJobs());
  }

  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }
}

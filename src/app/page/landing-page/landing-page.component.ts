import { Component } from '@angular/core';
import SwiperCore, { Autoplay, Mousewheel, Navigation, Pagination } from "swiper";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { JobPostService } from 'src/app/service/job-post.service';
import { filterConditions } from 'src/app/model/typescriptModel/job-post-model/jobPost.model';
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
  
    this.dispatchJobs();
    this.loadingFlag$ = this.store.select((state: any)=>
    state.jobpost.loading);
    this.items$ = this.store.select((state: any)=>
    state.jobpost.JobPost);
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

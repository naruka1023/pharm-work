import { Component } from '@angular/core';
import SwiperCore, { Autoplay, Mousewheel, Navigation, Pagination } from "swiper";
import { collection, getDocs } from "firebase/firestore";
import headerArray from 'src/app/model/data/uiKeys';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { JobPostService } from 'src/app/service/job-post.service';
import { AppState, filterConditions, jobPostModel, jobPostPayload } from 'src/app/model/typescriptModel/job-post-model/jobPost.model';
import { Store } from '@ngrx/store';
import { getJobs } from 'src/app/state/actions/job-post.actions';
import { selectJobPost, selectLoading } from 'src/app/state/selectors/job-post.selectors';

SwiperCore.use([Navigation, Pagination, Autoplay, Mousewheel]);

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {

  loadingFlag$!: Observable<boolean>;
  items$!: Observable<filterConditions[]>;
  constructor(private store: Store, private db: AngularFirestore, private jobPostService: JobPostService){
  }
  
  ngOnInit(){
  
    this.dispatchJobs();
    this.loadingFlag$ = this.store.select((state: any)=>
    state.jobpost.loading);
    this.loadingFlag$.subscribe(()=>{
      console.log(this.loadingFlag$);
    })
    this.items$ = this.store.select((state: any)=>
    state.jobpost.JobPost);
    this.items$.subscribe((res)=>{
      console.log(this.items$);
    })
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

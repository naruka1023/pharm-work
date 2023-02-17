import { Component } from '@angular/core';
import SwiperCore, { Autoplay, Mousewheel, Navigation, Pagination } from "swiper";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { filterConditions } from '../../model/typescriptModel/jobPost.model';
import { retrievedJobSuccess } from '../../state/actions/job-post.actions';
import { JobPostService } from '../../service/job-post.service';
// import { selectJobPost, selectLoading } from 'src/app/state/selectors/job-post.selectors';

SwiperCore.use([Navigation, Pagination, Autoplay, Mousewheel]);

@Component({
  selector: 'app-pharma-home',
  templateUrl: './pharma-home.component.html',
  styleUrls: ['./pharma-home.component.css']
})
export class PharmaHomeComponent {

  loadingFlag$!: Observable<boolean>;

  items$!: Observable<filterConditions[]>;
  constructor(private jobPostService:JobPostService, private store: Store, private db: AngularFirestore){
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
    this.jobPostService.getAllJobPost().subscribe((jobPosts)=>{
      this.store.dispatch(retrievedJobSuccess({jobs:jobPosts}))
    })
  }

  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }
}

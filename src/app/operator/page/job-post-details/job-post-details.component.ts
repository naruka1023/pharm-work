import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { profileHeaderJobPost } from '../../model/header.model';
import { jobPostModel } from '../../model/jobPost.model';

@Component({
  selector: 'app-job-post-details',
  templateUrl: './job-post-details.component.html',
  styleUrls: ['./job-post-details.component.css']
})
export class JobPostDetailsComponent {

  constructor(private route: ActivatedRoute, private auth: AngularFireAuth, private router: Router, private store: Store){}

  profilePayload$!:Observable<jobPostModel>;
  loading$!:Observable<boolean>;
  id!: string;
  categorySymbol!: string;
  profile!:jobPostModel;
  profileHeader!: profileHeaderJobPost;
  bookmarkLoadingFlag: boolean = false;
  bookmarkFlag$:Observable<boolean> = of(true);
  bookmarkID!: string; 
  localFlag: boolean = true;

  ngOnInit(){
    this.id = this.route.snapshot.queryParamMap.get('id')!;
    this.loading$ = this.store.select((state: any) =>{
      return state.createdJobs.loading;
    });
    this.loading$.subscribe((res)=>{
      if(res){
        this.router.navigate(['/operator'])
      }
    })
    this.profilePayload$ = this.store.select((state: any)=>{
      const allCreatedJobs: any = state.createdJobs.JobPost;

      let newJob:jobPostModel = allCreatedJobs.find((profile: any) =>{
          return profile.custom_doc_id == this.id
      })
      return newJob
    })
    this.profilePayload$.subscribe((res: jobPostModel)=>{
      if(res !== undefined){
        this.profile = res;
        this.profileHeader = {
          Establishment: this.profile.Establishment,
          JobType: this.profile.JobType
        }
      }
    })
    this.scrollUp();
  }

  
  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }
}
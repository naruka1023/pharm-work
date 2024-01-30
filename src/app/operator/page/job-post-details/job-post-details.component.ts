import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { profileHeaderJobPost } from '../../model/header.model';
import { jobPostModel } from '../../model/jobPost.model';
import { JobService } from '../../service/job.service';

@Component({
  selector: 'app-job-post-details',
  templateUrl: './job-post-details.component.html',
  styleUrls: ['./job-post-details.component.css']
})
export class JobPostDetailsComponent {

  constructor(private route: ActivatedRoute, private router: Router, private store: Store, private jobService:JobService){}

  profilePayload$!:Observable<jobPostModel>;
  loading$!:Observable<boolean>;
  Active$!:Observable<boolean>;
  activeFlag!: boolean
  id!: string;
  profile!:jobPostModel;
  bookmarkLoadingFlag: boolean = false;
  bookmarkFlag$:Observable<boolean> = of(true);
  bookmarkID!: string; 
  localFlag: boolean = true;
  zoom: number = 15
  center: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  }

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
    this.Active$ = this.store.select((state:any)=>{
      const selectedJob = state.createdJobs.JobPost.find((job: jobPostModel)=>{
        return job.custom_doc_id == this.id
      })
      return selectedJob !== undefined?selectedJob.Active: true;
    })
    this.Active$.subscribe((active)=>{

      this.activeFlag = active;
    })
    this.profilePayload$.subscribe((res: jobPostModel)=>{
      if(res !== undefined){
        this.profile = res;
        if(this.profile._geoloc !== undefined){
          this.center = this.profile._geoloc
          this.markerPosition = this.center
        }
      }
    })
    this.scrollUp();
  }

  editFlag(){
    this.router.navigate(['/operator/edit-jobs'], {
      queryParams: 
      {
        urgency: this.profile.Urgency,
        id: this.profile.custom_doc_id
      }
    })
  }
  
  toggleActive(){
    this.jobService.toggleActive(this.profile.custom_doc_id, this.activeFlag)
  }


  
  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }
}

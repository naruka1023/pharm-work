import { Component, Input} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { jobPostModel } from '../../model/jobPost.model';
import { JobService } from '../../service/job.service';
@Component({
  selector: 'app-job-post-normal-card',
  templateUrl: './job-post-normal-card.component.html',
  styleUrls: ['./job-post-normal-card.component.css']
})
export class JobPostNormalCardComponent{
  @Input() urgentFlag = true;
  @Input() fullTimeFlag = true;
  @Input() content!: jobPostModel
  subscription: Subscription = new Subscription();
  userID!: string
  bookmarkID!: string; 
  loadingFlag: boolean = false;
  activeLoadingFlag: boolean = false;
  Active$!: Observable<boolean>
  activeFlag!:boolean;
  buttonSetFlag:boolean = false
  
  constructor(private store:Store, private router: Router, private jobService:JobService, private activatedRoute:ActivatedRoute){}

  ngOnInit(){
    if(this.activatedRoute.snapshot.routeConfig?.path == 'all-jobs-posts'){
      this.buttonSetFlag = true;
    }
    if(this.urgentFlag){
      this.fullTimeFlag = false;
    }
    this.Active$ = this.store.select((state:any)=>{
      const selectedJob = state.createdJobs.JobPost.find((job: jobPostModel)=>{
        return job.custom_doc_id == this.content.custom_doc_id
      })
      return selectedJob.Active;
    })
    this.Active$.subscribe((active)=>{
      this.activeFlag = active;
    })
  }

  toggleActive(){
    this.jobService.toggleActive(this.content.custom_doc_id, this.activeFlag)
  }

  editFlag(){
    this.router.navigate(['/operator/edit-jobs'], {
      queryParams: 
      {
        urgency: this.urgentFlag,
        id: this.content.custom_doc_id
      }
    })
  }

  deleteCard(){
    this.loadingFlag = true;
    this.jobService.removeJob(this.content.custom_doc_id).then(()=>{
      this.loadingFlag = false;
    })
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }


  goToProfile(){
    this.router.navigate(['operator/job-detail'],
    {
      queryParams: 
      {
        id: this.content.custom_doc_id,
      }
    })
  }
}


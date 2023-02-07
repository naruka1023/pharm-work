import { Component, Input} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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

  
  constructor(private router: Router, private jobService:JobService){}

  ngOnInit(){

    if(this.urgentFlag){
      this.fullTimeFlag = false;
    }
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


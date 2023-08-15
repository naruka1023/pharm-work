import { Component, Input } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { jobPostModel } from '../model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-post-small-card',
  templateUrl: './job-post-small-card.component.html',
  styleUrls: ['./job-post-small-card.component.css']
})
export class JobPostSmallCardComponent {
  @Input() fullTimeFlag = true 
  @Input() urgentFlag = false;
  @Input() content!: jobPostModel
  bookmarkLoadingFlag!:boolean;  
  bookmarkFlag$:Observable<boolean> = of(true);
  userID!: string
  subscription: Subscription = new Subscription();
  bookmarkID!: string; 
  requestFlag$!:Observable<boolean>;
  localFlag: boolean = true;
  limit = 25
  establishmentLimit = 21;
  jobName!: string;
  establishmentName!: string;
  constructor(private router: Router){}
  ngOnInit(){
    if(this.content.cropProfilePictureUrl == ''){
      delete this.content.cropProfilePictureUrl
    }
  }

  goToProfile(){
    this.router.navigate(['/landing/job-post/' + this.content.custom_doc_id])
  }
}

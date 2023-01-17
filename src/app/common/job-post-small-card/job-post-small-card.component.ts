import { Component, Input } from '@angular/core';
import { jobPostModel } from 'src/app/model/typescriptModel/job-post-model/jobPost.model';

@Component({
  selector: 'app-job-post-small-card',
  templateUrl: './job-post-small-card.component.html',
  styleUrls: ['./job-post-small-card.component.css']
})
export class JobPostSmallCardComponent {
  @Input() fullTimeFlag = true 
  @Input() urgentFlag = false;
  @Input() content!: jobPostModel
  ngOnInit(){
    if(this.urgentFlag){
      this.fullTimeFlag = false;
    }
  }
}

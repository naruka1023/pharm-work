import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { jobPostModel } from 'src/app/model/typescriptModel/job-post-model/jobPost.model';
import { RoutingService } from 'src/app/service/routing.service';

@Component({
  selector: 'app-job-post-small-card',
  templateUrl: './job-post-small-card.component.html',
  styleUrls: ['./job-post-small-card.component.css']
})
export class JobPostSmallCardComponent {

  constructor(private routeService: RoutingService){}

  @Input() fullTimeFlag = true 
  @Input() urgentFlag = false;
  @Input() content!: jobPostModel
  ngOnInit(){
    if(this.urgentFlag){
      this.fullTimeFlag = false;
    }
  }
  goToProfile(){
    this.routeService.goToJobProfile(this.content.custom_doc_id, this.content.CategorySymbol)
  }
}

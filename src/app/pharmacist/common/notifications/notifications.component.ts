import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobPostService } from '../../service/job-post.service';
import { Store } from '@ngrx/store';
import { onSetJobNotifications } from '../../state/actions/notifications.actions.';
import { RoutingService } from '../../service/routing.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  jobPostUID!: string
  type!: string;
  pageStatus: string = 'loading'
  constructor(private activatedRoute: ActivatedRoute, private jobService: JobPostService, private store:Store, private routeService: RoutingService){

  }
  ngOnInit(){
    this.jobPostUID = this.activatedRoute.snapshot.queryParamMap.get('jobUID')!
    this.type = this.activatedRoute.snapshot.queryParamMap.get('type')!
    switch(this.type){
      case 'job-post':
          this.jobService.getJob(this.jobPostUID).then((job)=>{
            if(Object.keys(job).length > 1 && job.Active){
              this.store.dispatch(onSetJobNotifications({jobPost:job}));
              this.routeService.goToJobProfile(job.custom_doc_id, job.CategorySymbol, 'notification')
            }else{
              this.pageStatus = 'emptyJob'
            }
        })
      break;
    }

  }
}

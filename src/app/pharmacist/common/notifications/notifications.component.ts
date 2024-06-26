import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobPostService } from '../../service/job-post.service';
import { Store } from '@ngrx/store';
import { onSetJobNotifications } from '../../state/actions/notifications.actions.';
import { RoutingService } from '../../service/routing.service';
import { UserServiceService } from '../../service/user-service.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  jobPostUID!: string
  type!: string;
  pageStatus: string = 'loading'
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UserServiceService,private jobService: JobPostService, private store:Store, private routeService: RoutingService){

  }
  ngOnInit(){
    this.jobPostUID = this.activatedRoute.snapshot.queryParamMap.get('jobUID')!
    this.type = this.activatedRoute.snapshot.queryParamMap.get('type')!
    this.initNoti(this.jobPostUID, this.type)
  }

  initNoti(jobPost: string, type: string){
    this.pageStatus = 'loading'
    switch(type){
      case 'job-post':
        if(jobPost.indexOf('false') !== -1){
          this.router.navigate(['pharma'])
        }else{
          this.jobService.getJob(jobPost).then((job)=>{
              if(Object.keys(job).length > 1 && job.Active){
                this.store.dispatch(onSetJobNotifications({jobPost:job}));
                this.routeService.goToJobProfile(job.custom_doc_id, job.CategorySymbol, 'notification')
              }else{
                this.pageStatus = 'emptyJob'
              }
          })
        }
      break;
      case 'request-view':
        this.router.navigate(['pharma/profile-pharma/register-jobs/request-views'])
    }
  }
}

import { Component, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { jobPostModel } from 'src/app/model/typescriptModel/jobPost.model';
import { JobPostService } from 'src/app/service/job-post.service';
import { RoutingService } from 'src/app/service/routing.service';

@Component({
  selector: 'app-job-post-normal-card',
  templateUrl: './job-post-normal-card.component.html',
  styleUrls: ['./job-post-normal-card.component.css']
})
export class JobPostNormalCardComponent {
  @Input() urgentFlag = true;
  @Input() fullTimeFlag = true;
  @Input() content!: jobPostModel

  constructor(private router: Router, private auth: AngularFireAuth, private routeService:RoutingService){}
  ngOnInit(){
    if(this.urgentFlag){
      this.fullTimeFlag = false;
    }
  }
  acceptJob(){
    this.auth.user.subscribe((user)=>{
      if(user){
      }else{
        this.router.navigate(['login'])
      }
    })
  }

  goToProfile(){
    this.routeService.goToJobProfile(this.content.custom_doc_id, this.content.CategorySymbol)
  }

}

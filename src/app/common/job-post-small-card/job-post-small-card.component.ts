import { Component, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { jobPostModel } from 'src/app/model/typescriptModel/job-post-model/jobPost.model';
import { RoutingService } from 'src/app/service/routing.service';

@Component({
  selector: 'app-job-post-small-card',
  templateUrl: './job-post-small-card.component.html',
  styleUrls: ['./job-post-small-card.component.css']
})
export class JobPostSmallCardComponent {

  constructor(private auth: AngularFireAuth, private router: Router, private routeService: RoutingService){}

  @Input() fullTimeFlag = true 
  @Input() urgentFlag = false;
  @Input() content!: jobPostModel
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

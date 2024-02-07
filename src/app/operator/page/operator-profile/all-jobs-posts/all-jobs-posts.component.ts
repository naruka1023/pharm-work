import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { jobPostModel } from 'src/app/operator/model/jobPost.model';
import { JobService } from 'src/app/operator/service/job.service';
declare var window: any;

@Component({
  selector: 'app-all-jobs-posts',
  templateUrl: './all-jobs-posts.component.html',
  styleUrls: ['./all-jobs-posts.component.css']
})
export class AllJobsPostsComponent {
  constructor(private store: Store, private jobService:JobService){}
  allCreatedJobs$!: Observable<jobPostModel[]>;
  loading$!: Observable<boolean>;
  emptyFlag$!: Observable<boolean>
  emptyFlagNormal$!: Observable<boolean>
  emptyFlagUrgency$!: Observable<boolean>
  formModal: any;
  deleteJobCardFlag: boolean = true
  idToDelete: string = ''
  ngOnInit(){
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('confirmRequest')
      );
    this.allCreatedJobs$ = this.store.select((state:any)=>{
      return state.createdJobs.JobPost;
    })
    this.emptyFlag$ = this.store.select((state: any)=>{
      return state.createdJobs.JobPost.length === 0
    })
    this.emptyFlagNormal$ = this.store.select((state: any)=>{
      let newCreatedJobs: jobPostModel[] = _.cloneDeep(state.createdJobs.JobPost)
      newCreatedJobs = newCreatedJobs.filter((job)=>{
        return job.Urgency == false
      })
      return newCreatedJobs.length === 0
    })
    this.emptyFlagUrgency$ = this.store.select((state: any)=>{
      let newCreatedJobs: jobPostModel[] = _.cloneDeep(state.createdJobs.JobPost)
      newCreatedJobs = newCreatedJobs.filter((job)=>{
        return job.Urgency == true
      })
      return newCreatedJobs.length === 0
    })
    this.loading$ = this.store.select((state:any)=>{
      return state.createdJobs.loading
    })
  }

  openModal(id: string){
    this.idToDelete = id
    this.formModal.show();
  }

  onClose(){
    this.deleteJobCardFlag = false
    this.formModal.hide()
  }
  
  
  deleteCard(){
    this.deleteJobCardFlag = true
    this.formModal.hide()
    this.jobService.removeJob(this.idToDelete)
  }

}

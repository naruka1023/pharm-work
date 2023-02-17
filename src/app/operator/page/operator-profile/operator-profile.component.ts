import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, take } from 'rxjs';
import { JobService } from '../../service/job.service';
import { ProfileService } from '../../service/profile.service';
import { getCreatedJobsSuccess } from '../../state/actions/job-post.actions';
declare var window: any;

@Component({
  selector: 'app-operator-profile',
  templateUrl: './operator-profile.component.html',
  styleUrls: ['./operator-profile.component.css']
})
export class OperatorProfileComponent {
  subscription:Subscription = new Subscription;
  formModal!: any
  loadingFlag: boolean = true;

  constructor(private profileService:ProfileService, private store:Store, private jobService:JobService){}
  ngOnInit(): void {
    this.subscription.add(this.store.select((state:any)=>{
      return state.createdJobs.loading
    }).subscribe((loading)=>{
      this.loadingFlag = loading;
    }))
    this.subscription.add(this.profileService.getRevertTabSubject().subscribe(()=>{
      document.getElementById('profileTab')?.click();
    }));
    this.subscription.add(this.store.select((state: any)=>{
      return state.user.uid
    }).subscribe((operatorUID:any)=>{
      if(operatorUID !== '' && this.loadingFlag){
        this.jobService.getJobsCreated(operatorUID).subscribe((jobs)=>{
          this.store.dispatch(getCreatedJobsSuccess({jobs:jobs}));
        })
      }
    }))
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );
    this.subscription = this.profileService.getCallView().pipe().subscribe(()=>{
      this.openFormModal();
    })
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  openFormModal() {
    this.formModal.show();
  }
}

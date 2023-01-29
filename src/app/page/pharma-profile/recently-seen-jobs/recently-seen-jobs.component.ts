import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { jobPostModel } from 'src/app/model/typescriptModel/jobPost.model';

@Component({
  selector: 'app-recently-seen-jobs',
  templateUrl: './recently-seen-jobs.component.html',
  styleUrls: ['./recently-seen-jobs.component.css']
})
export class RecentlySeenJobsComponent {
  recentlySeen$!: Observable<jobPostModel[]>
  constructor(private store: Store){}
  ngOnInit(){
    this.recentlySeen$ = this.store.select((state: any)=>{
      return state.recentlySeen;
    })
  }
}

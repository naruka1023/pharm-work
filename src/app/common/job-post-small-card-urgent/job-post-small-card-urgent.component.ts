import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-job-post-small-card-urgent',
  templateUrl: './job-post-small-card-urgent.component.html',
  styleUrls: ['./job-post-small-card-urgent.component.css']
})
export class JobPostSmallCardUrgentComponent {
  @Input() fullTimeFlag = true 
}

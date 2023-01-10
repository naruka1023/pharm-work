import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-job-post-small-card',
  templateUrl: './job-post-small-card.component.html',
  styleUrls: ['./job-post-small-card.component.css']
})
export class JobPostSmallCardComponent {
  @Input() fullTimeFlag = true 
  @Input() urgentFlag = false;

  ngOnInit(){
    if(this.urgentFlag){
      this.fullTimeFlag = false;
    }
  }
}

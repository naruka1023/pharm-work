import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-job-post-normal-card',
  templateUrl: './job-post-normal-card.component.html',
  styleUrls: ['./job-post-normal-card.component.css']
})
export class JobPostNormalCardComponent {
  @Input() urgentFlag = true;
  @Input() fullTimeFlag = true;

  ngOnInit(){
    if(this.urgentFlag){
      this.fullTimeFlag = false;
    }
  }
}

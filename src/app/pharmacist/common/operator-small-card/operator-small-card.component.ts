import { Component, Input } from '@angular/core';
import { userOperator } from '../../model/typescriptModel/jobPost.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operator-small-card',
  templateUrl: './operator-small-card.component.html',
  styleUrls: ['./operator-small-card.component.css']
})
export class OperatorSmallCardComponent {
  @Input() content!: userOperator
  constructor(private router: Router){}
  ngOnInit(){
    if(this.content.cropProfilePictureUrl == ''){
      delete this.content.cropProfilePictureUrl
    }
  }
  goToOperatorProfile(){
    this.router.navigate(['/pharma/operator-page'], {
      queryParams: 
      {
        operatorUID: this.content.uid,
        followFlag: false,
        requestViewFlag: false,
        operatorExistFlag: true,
        jobType: this.content.jobType
      }
    })
  }

}

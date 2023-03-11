import { Component, Input } from '@angular/core';
import { userOperator } from '../../model/typescriptModel/jobPost.model';

@Component({
  selector: 'app-operator-normal-card',
  templateUrl: './operator-normal-card.component.html',
  styleUrls: ['./operator-normal-card.component.css']
})
export class OperatorNormalCardComponent {
  @Input()content!: userOperator
}

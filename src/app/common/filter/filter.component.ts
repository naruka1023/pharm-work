import { Component, Input } from '@angular/core';
import { filterConditions } from 'src/app/model/typescriptModel/jobPost.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  @Input() filterFlags!: filterConditions;
}

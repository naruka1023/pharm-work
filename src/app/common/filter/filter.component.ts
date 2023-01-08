import { Component, Input } from '@angular/core';
import { filterConditions } from 'src/app/model/filter-conditions/filter-conditions';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  @Input() filterFlags!: filterConditions;
  
  ngOnInit(){
    console.log(this.filterFlags);
  }
}

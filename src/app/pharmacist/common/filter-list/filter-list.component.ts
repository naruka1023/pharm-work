import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.css']
})
export class FilterListComponent {
  @Input() header!:string
  @Input() brandToCategory: string = '';
  nearLocationFlag: boolean = false 

  onChangeEvent(event: any){
    this.nearLocationFlag = event.target.checked;
  }
}

import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable, map } from 'rxjs';
import { OperatorNormalCardComponent } from 'src/app/pharmacist/common/operator-normal-card/operator-normal-card.component';
import { requestView, requestViewList } from 'src/app/pharmacist/model/typescriptModel/users.model';
declare var window: any;

@Component({
  selector: 'app-request-view',
  templateUrl: './request-view.component.html',
  styleUrls: ['./request-view.component.css']
})
export class RequestViewComponent {
  requestViews$!: Observable<requestView[]>
  requestViewFlag: boolean = true;
  emptyFlag$!: Observable<boolean>
  
  constructor(private store: Store){}
  
  ngOnInit(){
    this.emptyFlag$ = this.store.select((state: any)=>{
      return Object.keys(state.requestView).length == 0
    })
    this.requestViews$ = this.store.select((state:any)=>{
      let requestViews: requestViewList = state.requestView;
      let requestViewsArray = []
      for (const [key, value] of Object.entries(requestViews)) {
        requestViewsArray.push(value);
      }
      return requestViewsArray
    }).pipe(
      map((array)=>{
        return array
      }))
  }
}

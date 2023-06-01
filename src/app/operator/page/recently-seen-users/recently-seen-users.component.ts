import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserPharma } from '../../model/user.model';
import { JobTypeConverterService } from '../../service/job-type-converter.service';

@Component({
  selector: 'app-recently-seen-users',
  templateUrl: './recently-seen-users.component.html',
  styleUrls: ['./recently-seen-users.component.css']
})
export class RecentlySeenUsersComponent {
  recentlySeen$!: Observable<UserPharma[]>
  emptyFlag$!: Observable<boolean>
  constructor(private store: Store, private converter:JobTypeConverterService){}
  ngOnInit(){
    this.emptyFlag$ = this.store.select((state: any)=>{
      return state.recentlySeen.length === 0
    })
    this.recentlySeen$ = this.store.select((state: any)=>{

      return state.recentlySeen.map((user: UserPharma)=>{
        return {
          ...user,
          soleJobType: this.converter.getCategorySymbolFromTitle(user.preferredJobType![0])
        }
      });
    })
  }
}

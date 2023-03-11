import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { JobTypeConverterService } from 'src/app/pharmacist/service/job-type-converter.service';
import { UserPharma } from '../../model/user.model';

@Component({
  selector: 'app-recently-seen-users',
  templateUrl: './recently-seen-users.component.html',
  styleUrls: ['./recently-seen-users.component.css']
})
export class RecentlySeenUsersComponent {
  recentlySeen$!: Observable<UserPharma[]>
  constructor(private store: Store, private converter:JobTypeConverterService){}
  ngOnInit(){
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

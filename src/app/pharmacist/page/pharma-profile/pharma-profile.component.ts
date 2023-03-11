import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, take } from 'rxjs';
import { UserServiceService } from '../../service/user-service.service';
declare var window: any;

@Component({
  selector: 'app-pharma-profile',
  templateUrl: './pharma-profile.component.html',
  styleUrls: ['./pharma-profile.component.css']
})
export class PharmaProfileComponent implements OnDestroy{
  constructor(private userService: UserServiceService, private store: Store){}
  sub: Subscription = new Subscription()
  formModal!: any
  ngOnInit(){
    this.sub.add(this.userService.getRevertTabSubject().subscribe(()=>{
      document.getElementById('inner-profile')?.click();
    }));
    this.sub.add(
      this.store.select((state:any)=>{
        return state.pharmaProfile.url !== ''? state.pharmaProfile.url : '';
      }).pipe(take(1)).subscribe((url: string)=>{
        console.log('print')
        document.getElementById(url)?.click();
      })
    )
    this.scrollUp();
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );
    this.sub.add(this.userService.getCallView().pipe().subscribe(()=>{
      this.openFormModal();
    }))
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
  }
  openFormModal() {
    this.formModal.show();
  }
  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }
}

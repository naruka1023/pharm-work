import { Component, inject } from '@angular/core';
import { Auth, sendEmailVerification } from '@angular/fire/auth';
import { Storage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { removeCurrentUser } from '../state/actions/users.action';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent {

  constructor(private router: ActivatedRoute, private store:Store, private route: Router) {}

  private auth: Auth = inject(Auth);
  email: string = ''

  ngOnInit(){
    this.email = this.router.snapshot.queryParamMap.get('email')!
  }
  confirmSignout(){
    this.auth.signOut().then(()=>{
      this.route.navigate([''])
    });
    this.store.dispatch(removeCurrentUser());
  }
  sendConfirmEmail(){
    sendEmailVerification(this.auth.currentUser!).then(()=>{}).catch((reason)=>{
    })
  }
}

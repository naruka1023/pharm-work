import { Component, inject } from '@angular/core';
import { Auth, sendEmailVerification } from 'firebase/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { removeCurrentUser } from '../state/actions/users.action';
import { FirebaseService } from '../service/firebase.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css'],
})
export class ConfirmEmailComponent {
  constructor(
    private router: ActivatedRoute,
    private firebaseService: FirebaseService,
    private store: Store,
    private route: Router
  ) {}

  private auth: Auth = this.firebaseService.auth;
  email: string = '';

  ngOnInit() {
    this.email = this.router.snapshot.queryParamMap.get('email')!;
  }
  confirmSignout() {
    this.auth.signOut().then(() => {
      this.route.navigate(['']);
    });
    this.store.dispatch(removeCurrentUser());
  }
  sendConfirmEmail() {
    sendEmailVerification(this.auth.currentUser!)
      .then(() => {})
      .catch((reason) => {});
  }
}

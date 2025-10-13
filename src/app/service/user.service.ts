import { Injectable, inject } from '@angular/core';
import { User } from '../model/user.model';
import { FirebaseService } from './firebase.service';
import { doc, Firestore, getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firebaseService: FirebaseService) {}

  private db: Firestore = this.firebaseService.firestore;

  async getUser(uid: string) {
    const user = await getDoc(doc(this.db, 'users', uid));
    const result: User = {
      ...(user.data() as User),
      uid: uid,
    };
    return result;
  }
}

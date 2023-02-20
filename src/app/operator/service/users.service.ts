import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { UserPharma } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private db: AngularFirestore) { }

  getAllPharmaUsers(): Observable<UserPharma []>{
    return this.db.collection('users', ref => ref.where('role', '==', 'เภสัชกร').limit(25)).valueChanges() as Observable<UserPharma []>
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, distinctUntilChanged, map } from 'rxjs';
import { User } from '../pharmacist/model/typescriptModel/users.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  getUser(uid: string) : Observable<User>{
    return this.db.collection("users").doc(uid).get().pipe(
      distinctUntilChanged(),
      map((src: any) => {
        let result: User = {
          ...src.data(),
          uid:uid
        }
        return result;
      })
    );
  }

  constructor(private db: AngularFirestore) { }
}

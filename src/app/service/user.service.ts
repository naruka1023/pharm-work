import { Injectable, inject } from '@angular/core';
import { User } from '../model/user.model';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private db: Firestore = inject(Firestore)

  async getUser(uid: string){
    let user = await getDoc(doc(this.db, 'users', uid))
    let result: User = {
      ...user.data() as User,
      uid:uid
    }
    return result;
    
  }
}

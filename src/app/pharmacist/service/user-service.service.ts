import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, map, Observable, of, Subject } from 'rxjs';
import { User } from '../model/typescriptModel/users.model';
import { getCurrentUser } from '../../state/actions/users.action';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private store: Store, private db: AngularFirestore) { }
  editSubject: Subject<boolean> = new Subject();
  leaveEditSubject: Subject<string> = new Subject();
  revertTabSubject: Subject<void> = new Subject();
  callView: Subject<void> = new Subject();

  getRevertTabSubject(): Observable<void>{
    return this.revertTabSubject.asObservable();
  }
  
  sendRevertTabSubject(){
    return this.revertTabSubject.next();
  }

  getCallView(): Observable<void>{
    return this.callView.asObservable();
  }
  sendCallView(){
    return this.callView.next();
  }

  getLeaveEditSubject(): Observable<string>{
    return this.leaveEditSubject.asObservable();
  }
  
  sendLeaveEditSubject(url: string){
    return this.leaveEditSubject.next(url);
  }

  getEditSubject(): Observable<boolean>{
    return this.editSubject.asObservable();
  }
  
  sendEditSubject(){
    return this.editSubject.next(true);
  }
  getOperatorData(operatorUID:string){
    return this.db.collection("users").doc(operatorUID).get()
  }
  updateUser(user: User) : Promise<void>{
     return this.db.collection("users").doc(user.uid).set(user)
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private store: Store, private db: AngularFirestore) { }
  editSubject: Subject<boolean> = new Subject();
  leaveEditSubject: Subject<string> = new Subject();
  revertTabSubject: Subject<void> = new Subject();
  callView: Subject<void> = new Subject();
  getCallView(): Observable<void>{
    return this.callView.asObservable();
  }
  
  getRevertTabSubject(): Observable<void>{
    return this.revertTabSubject.asObservable();
  }
  
  sendRevertTabSubject(){
    return this.revertTabSubject.next();
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
  updateUser(user: User) : Promise<void>{
     return this.db.collection("users").doc(user.uid).update(user)
  }
}

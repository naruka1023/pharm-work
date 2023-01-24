import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { registerFormPharmacist, registerFormOperator, User } from '../model/typescriptModel/users.model';
import { setCurrentUser } from '../state/actions/users.action';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private store: Store) { }
  editSubject: Subject<boolean> = new Subject();

  getEditSubject(): Observable<boolean>{
    return this.editSubject.asObservable();
  }
  
  sendEditSubject(){
    return this.editSubject.next(true);
  }

  passUserData(role: string, newUser: User){
    let argument: any = {
      userState: {
        role: role,
        email: newUser.email,
        Location: {
          Section: 'Wattana',
          District: 'Klongton',
          Province: 'Bangkok'
        }
      }
    }
    if(role == 'เภสัชกร'){
      argument.userState['name'] = ('name' in newUser)?newUser['name']: ''
      argument.userState['surname'] = ('surname' in newUser)?newUser['surname']: ''
      argument.userState['license'] = ('license' in newUser)?newUser['license']: ''
    }else{
      argument.userState['companyName'] = ('companyName' in newUser)?newUser['companyName']: ''
      argument.userState['companyID'] = ('companyID' in newUser)?newUser['companyID']: ''
    }
    this.store.dispatch(setCurrentUser(argument))
  }
}

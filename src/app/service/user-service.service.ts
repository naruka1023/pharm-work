import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { registerFormPharmacist, registerFormOperator } from '../model/typescriptModel/users.model';
import { setCurrentUser } from '../state/actions/users.action';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private store: Store) { }
  passUserData(role: string, newUser: registerFormPharmacist | registerFormOperator){
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
    }else{
      argument.userState['companyName'] = ('companyName' in newUser)?newUser['companyName']: ''
    }
    this.store.dispatch(setCurrentUser(argument))
  }
}

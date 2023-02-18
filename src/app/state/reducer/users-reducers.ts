import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import { User } from '../../pharmacist/model/typescriptModel/users.model';
import { getCurrentUser, removeCurrentUser, setCurrentUser } from '../actions/users.action';

// import { retrievedBookList } from './books.actions';
// import { Book } from '../book-list/books.model';

export const initialState: User = {
  loading: true,
  role: '',
  email: '',
  uid: '',
  name: '',
  surname: '',
  showProfileFlag:true,
  license: '',
  AmountCompleted: 0,
  contacts:{
    facebook: '',
    line: '',
    phone: '',
    email: ''
  }
};

export const usersReducer = createReducer(
  initialState,
  on(setCurrentUser, (state, { user }) => {
    return {
      ...user,
    }
  }),
  on(getCurrentUser, (state) => {
    return {
      ...state
    }
  }),
  on(removeCurrentUser, (state) => {
    return {
      ...initialState
    }
  }),
);


/*
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://github.com/ngrx/platform
*/
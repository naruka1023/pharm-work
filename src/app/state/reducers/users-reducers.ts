import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import { AppState } from 'src/app/model/typescriptModel/jobPost.model';
import { User } from 'src/app/model/typescriptModel/users.model';
import { removeCurrentUser, setCurrentUser } from '../actions/users.action';

// import { retrievedBookList } from './books.actions';
// import { Book } from '../book-list/books.model';

export const initialState: User = {
  role: '',
  email: '',
  Location: {
      Section: '',
      District: '',
      Province: '',
  },
};

export const usersReducer = createReducer(
  initialState,
  on(setCurrentUser, (state, { userState }) => {
    return {
      ...userState
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
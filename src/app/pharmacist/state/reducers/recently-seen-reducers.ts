import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import { jobPostModel } from '../../model/typescriptModel/jobPost.model';
import { addRecentlySeen, removeRecentlySeen } from '../actions/recently-seen.actions';
import { getCurrentUser, removeCurrentUser, setCurrentUser } from '../../../state/actions/users.action';


export const initialState: jobPostModel[] = [];

export const recentlySeenReducer = createReducer(
  initialState,
  on(addRecentlySeen, (state, { JobPost }) => {
    let newState : jobPostModel[]= _.cloneDeep(state);
    newState.unshift(JobPost)
    return newState
  }),
  on(removeRecentlySeen, (state) => {
    let newState : jobPostModel[]= _.cloneDeep(state);
    newState.pop()
    return newState
  }),
);


/*
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://github.com/ngrx/platform
*/
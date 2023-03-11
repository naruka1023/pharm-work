import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import { UserPharma } from '../../model/user.model';
import { addRecentlySeen, removeRecentlySeen } from '../actions/recently-seen.actions';


export const initialState: UserPharma[] = [];

export const recentlySeenReducer = createReducer(
  initialState,
  on(addRecentlySeen, (state, { user }) => {
    let newState : UserPharma[]= _.cloneDeep(state);
    newState.unshift(user)
    return newState
  }),
  on(removeRecentlySeen, (state) => {
    let newState : UserPharma[]= _.cloneDeep(state);
    newState.pop()
    return newState
  }),
);

import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import { setURL } from '../actions/operator-profile.actions';


export const initialState: any = {
  url: ''
};

export const pharmaProfileReducer = createReducer(
  initialState,
  on(setURL, (state, { url }) => {
    let newState : any = _.cloneDeep(state);
    newState.url = url
    return newState
  }),
);

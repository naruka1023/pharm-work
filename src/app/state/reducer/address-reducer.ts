import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import  * as json from '../../utils/address.json' 
import  * as jsonBTS from '../../utils/bts.json' 
import  * as jsonMRT from '../../utils/mrt.json' 
import  * as jsonARL from '../../utils/arl.json' 
import  * as jsonSRT from '../../utils/srt.json' 
import { removeDefaultKey, toggleAddressChange } from '../actions/address.action';

export let initialState = {
  list: json,
  bts: jsonBTS,
  mrt: jsonMRT,
  arl: jsonARL,
  srt: jsonSRT,
  flag: true
};
export const addressReducer = createReducer(
  initialState,
  on(toggleAddressChange, (state: any) => {
    return {
      ...state,
      flag: !state.flag
    }
  }),
  on(removeDefaultKey, (state: any) => {
    let newState = _.cloneDeep(state);
    newState.list = newState.list.default 
    newState.bts = newState.bts.default 
    newState.mrt = newState.mrt.default 
    newState.arl = newState.arl.default 
    newState.srt = newState.srt.default 
    return {
      ...newState
    }
  }),
);


/*
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://github.com/ngrx/platform
*/
import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import { UserPharma, requestViewList } from '../../model/user.model';
import { addRequestView, modifyRequestView, removeRequestView, setRequestView } from '../actions/request-view.actions';


export const initialState: requestViewList = {};

export const requestViewReducer = createReducer(
  initialState,
  on(setRequestView, (state, { requestViewList }) => {
    return {
      ...state,
      ...requestViewList
    }
  }),
  on(modifyRequestView, (state, { requestView }) => {
    let newState : requestViewList = _.cloneDeep(state);
    newState[requestView.userUID + '-' + requestView.operatorUID].status = requestView.status
    return newState
  }),
  on(addRequestView, (state, { requestView }) => {
    let newState : requestViewList = _.cloneDeep(state);
    newState[requestView.userUID + '-' + requestView.operatorUID] = requestView
    return newState
  }),
  on(removeRequestView, (state, { requestView }) => {
    let newState : requestViewList = _.cloneDeep(state);
    delete newState[requestView.userUID + '-' + requestView.operatorUID]
    return newState
  })
);

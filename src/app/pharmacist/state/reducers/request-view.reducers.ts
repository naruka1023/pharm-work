import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import { addRequestView, modifyRequestView, removeRequestView, setRequestView } from '../actions/request-view.actions';
import { requestViewList } from '../../model/typescriptModel/users.model';


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
  on(removeRequestView, (state, { requestView }) => {
    let newState : requestViewList = _.cloneDeep(state);
    delete newState[requestView.userUID + '-' + requestView.operatorUID]
    return newState
  }),
  on(addRequestView, (state, { requestView }) => {
    let newState : requestViewList = _.cloneDeep(state);
    newState[requestView.userUID + '-' + requestView.operatorUID] = requestView
    return newState
  }),
);

import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import { AppStateJobRequest } from '../../model/jobPost.model';
import { emptyRequestedJobs, populateJobRequestWithUser, populateJobRequestWithUsers, removeUserFromRequestedJob, setRequestedJobs, toggleUserList } from '../actions/job-request-actions';

export const initialState: AppStateJobRequest = {
  loadingRequest: true,
  JobRequests: {}
};

export const jobRequestReducer = createReducer(
  initialState,
  on(toggleUserList, (state, {jobUIDForUsers}) =>{
    let newState: AppStateJobRequest =  _.cloneDeep(state);
    newState.JobRequests[jobUIDForUsers.jobUID].flag = jobUIDForUsers.flag!;
    return newState;
  }),
  on(populateJobRequestWithUsers, (state, {jobUIDForUsers}) =>{
    let newState: AppStateJobRequest =  _.cloneDeep(state);
    newState.JobRequests[jobUIDForUsers.jobUID].users = jobUIDForUsers.userList!;
    newState.JobRequests[jobUIDForUsers.jobUID].flag = false;
    return newState;
  }),
  on(populateJobRequestWithUser, (state, {jobUIDForUser}) =>{
    let newState: AppStateJobRequest =  _.cloneDeep(state);
    newState.JobRequests[jobUIDForUser.jobUID].users[jobUIDForUser.user!.uid] = jobUIDForUser.user!;
    return newState;
  }),
  on(removeUserFromRequestedJob, (state, {jobUIDForUser}) =>{
    let newState: AppStateJobRequest =  _.cloneDeep(state);
    delete newState.JobRequests[jobUIDForUser.jobUID].users[newState.JobRequests[jobUIDForUser.jobUID].jobRequest.userUID]
    return newState;
  }),
  on(setRequestedJobs, (state, {jobRequest}) =>{
    let newState: AppStateJobRequest =  _.cloneDeep(state);
    console.log(newState);
    newState.JobRequests = jobRequest
    return {
      ...newState,
    loadingRequest:false
  }
  }),
  on(emptyRequestedJobs, (state)=>{
    return {
      ...state,
      JobRequests : {}
    }
  }),
);
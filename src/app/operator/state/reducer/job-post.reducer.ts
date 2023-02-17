import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import { AppState, jobRequest } from '../../model/jobPost.model';
import {  emptyRequestedJobs, getCreatedJobsSuccess, getRequestedJobs } from '../actions/job-post.actions';

export const initialState: AppState = {
  loading: true,
  JobPost: [],
  JobRequests: {}
};

export const jobPostReducer = createReducer(
  initialState,
  on(getCreatedJobsSuccess, (state, { jobs }) => {
    return {
      ...state,
      JobPost: jobs,
      loading: false
    }
  }),
  on(getRequestedJobs, (state, {jobRequest}) =>{
    let newState: AppState =  _.cloneDeep(state);
    let newJobRequest: any = {};
    jobRequest.forEach((jr: jobRequest)=>{
      let keys = jr.jobUID + '-' + jr.userUID
      newJobRequest[keys] = {
        ...jr
      }

    })
    return {
      ...newState,
      JobRequests:newJobRequest
      
    }
  }),
  on(emptyRequestedJobs, (state)=>{
    return {
      ...state,
      JobRequests : {}
    }
  }),
);
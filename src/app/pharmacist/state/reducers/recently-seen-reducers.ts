import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import { jobPostModel } from '../../model/typescriptModel/jobPost.model';
import { addRecentlySeen, removeRecentlySeen, updateRecentlySeenJob } from '../actions/recently-seen.actions';
import { getCurrentUser, removeCurrentUser, setCurrentUser } from '../../../state/actions/users.action';


export const initialState: jobPostModel[] = [];

export const recentlySeenReducer = createReducer(
  initialState,
  on(addRecentlySeen, (state, { JobPost }) => {
    let newState : jobPostModel[]= _.cloneDeep(state);
    newState = newState.filter((job: jobPostModel)=>{
      return job.custom_doc_id !== JobPost.custom_doc_id
    })
    newState.unshift(JobPost)
    return newState
  }),
  on(updateRecentlySeenJob, (state, {jobUID, JobPost})=>{
    let newState: jobPostModel[] = _.cloneDeep(state)
    return newState.map((profile: any) =>{
      if(profile.custom_doc_id == jobUID){
        return JobPost
      }
      return profile
    })
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
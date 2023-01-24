import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import { AppState } from 'src/app/model/typescriptModel/jobPost.model';
import { getJobCategory, getJobs, retrievedJobCategorySuccess, retrievedJobSuccess } from '../actions/job-post.actions';

// import { retrievedBookList } from './books.actions';
// import { Book } from '../book-list/books.model';

export const initialState: AppState = {
  loading: true,
  JobPost: []
};

export const jobPostReducer = createReducer(
  initialState,
  on(getJobs, (state) => state),
  on(getJobCategory, (state) => state),
  on(retrievedJobSuccess, (state, { jobs }) => {
    return {
      ...state,
      loading: false,
      JobPost: jobs
    }
  }),
  on(retrievedJobCategorySuccess, (state:AppState, { jobs }) => {
    let newState: AppState =  _.cloneDeep(state);
    newState.JobPost = newState.JobPost.map((job) =>{
      let newJob = _.cloneDeep(job);
      if(job.CategorySymbol == jobs.CategorySymbol){
        newJob.allContent = jobs.JobsPost
        return newJob;
      }
      return job;
    })
    return {
      ...newState,
    }
  })
);


/*
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://github.com/ngrx/platform
*/
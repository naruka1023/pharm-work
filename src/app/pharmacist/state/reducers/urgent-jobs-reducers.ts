import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import headerArray from '../../model/data/uiKeys';
import { AppState, jobPostModel } from '../../model/typescriptModel/jobPost.model';
import { emptyUrgentJobs, getUrgentJobsSuccess } from '../actions/urgent-jobs.actions';

// import { retrievedBookList } from './books.actions';
// import { Book } from '../book-list/books.model';

export const initialState: any = {urgentJobs: []}
export const urgentJobsReducer = createReducer(
  initialState,

  on(emptyUrgentJobs, (state) =>{
    return {
      urgentJobs: []
    }
  }),

  on(getUrgentJobsSuccess, (state, {jobs}) =>{
    let newState: jobPostModel[] =  _.cloneDeep(state);
    return {urgentJobs: jobs}
  }),
);


/*
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://github.com/ngrx/platform
*/
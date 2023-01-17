import { createReducer, on, Action } from '@ngrx/store';
import { getJobs, retrievedJobSuccess } from '../actions/job-post.actions';

// import { retrievedBookList } from './books.actions';
// import { Book } from '../book-list/books.model';

export const initialState: any = {
  loading: true,
  JobPost: []
};

export const jobPostReducer = createReducer(
  initialState,
  on(getJobs, (state) => state),
  on(retrievedJobSuccess, (state, { jobs }) => {
    return {
      ...state,
      loading: false,
      JobPost: jobs
    }
  })
);


/*
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://github.com/ngrx/platform
*/
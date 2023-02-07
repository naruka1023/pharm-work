import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import { AppState } from '../../model/jobPost.model';
import {  getCreatedJobsSuccess } from '../actions/job-post.actions';

// import { retrievedBookList } from './books.actions';
// import { Book } from '../book-list/books.model';

export const initialState: AppState = {
  loading: true,
  JobPost: [],
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
);
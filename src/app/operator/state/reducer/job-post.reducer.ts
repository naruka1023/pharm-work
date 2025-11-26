import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import {
  AppState,
  collatedJobRequest,
  jobPostModel,
  jobRequest,
} from '../../model/jobPost.model';
import {
  getCreatedJobSuccess,
  toggleCreatedJobLoading,
  toggleFirstNotificationJob,
} from '../actions/job-post.actions';

export const initialState: AppState = {
  loading: true,
  JobPost: [],
};

export const jobPostReducer = createReducer(
  initialState,
  on(getCreatedJobSuccess, (state, { job, docType }) => {
    let newJobPost = _.cloneDeep(state.JobPost);
    switch (docType) {
      case 'added':
        newJobPost.unshift(job);
        break;
      case 'modified':
        newJobPost = newJobPost.map((jobPost: jobPostModel) => {
          if (jobPost.custom_doc_id == job.custom_doc_id) {
            return job;
          }
          return jobPost;
        });
        break;
      case 'removed':
        newJobPost = newJobPost.filter((jobPost: jobPostModel) => {
          return jobPost.custom_doc_id !== job.custom_doc_id;
        });
        break;
    }
    return {
      ...state,
      JobPost: newJobPost,
      loading: false,
    };
  }),
  on(toggleFirstNotificationJob, (state, { jobUID }) => {
    let newJobPost = _.cloneDeep(state.JobPost);
    newJobPost = newJobPost.map((jobPost: jobPostModel) => {
      if (jobPost.custom_doc_id == jobUID) {
        return {
          ...jobPost,
          firstNotificationFlag: false,
        };
      }
      return jobPost;
    });
    return {
      ...state,
      loading: false,
    };
  }),
  on(toggleCreatedJobLoading, (state) => {
    return {
      ...state,
      loading: false,
    };
  })
);

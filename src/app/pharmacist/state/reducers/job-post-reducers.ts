import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import headerArray from '../../model/data/uiKeys';
import { AppState, BookmarkList, jobPostModel, jobRequest } from '../../model/typescriptModel/jobPost.model';
import { addBookmark, emptyBookmark, emptyRequestedJobs, getJobCategory, getRequestedJobs, removeBookmark, retrievedJobCategorySuccess, retrievedJobSuccess, retrievedUserBookmarkSuccess } from '../actions/job-post.actions';

// import { retrievedBookList } from './books.actions';
// import { Book } from '../book-list/books.model';

export const initialState: AppState = {
  loading: true,
  JobPost: headerArray,
  Bookmarks: {},
  JobRequests:{}
};

export const jobPostReducer = createReducer(
  initialState,
  on(getJobCategory, (state) => state),
  on(removeBookmark, (state, {jobUID, userUID}) =>{
    let newState: AppState =  _.cloneDeep(state);
    let keys = jobUID + "-" + userUID
    delete newState.Bookmarks[keys];
    return {...newState}
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
  on(addBookmark, (state, {jobUID, userUID, bookmarkUID, JobPost}) =>{
    let newState: AppState =  _.cloneDeep(state);
    let keys = jobUID + "-" + userUID
    newState.Bookmarks[keys] = {
      jobUID: jobUID,
      userUID: userUID,
      bookmarkUID: bookmarkUID,
      JobPost: JobPost
    }
    return {
      ...newState
    }
  } ),
  on(retrievedJobSuccess, (state, { jobs }) => {
    return {
      ...state,
      loading: false,
      JobPost: jobs
    }
  }),
  on(emptyBookmark, (state) =>{
    return {
      ...state, 
      Bookmarks: {}
    }
  }),
  on(emptyRequestedJobs, (state)=>{
    return {
      ...state,
      JobRequests : {}
    }
  }),
  on(retrievedUserBookmarkSuccess, (state, { Bookmarks }) => {
    let newState: AppState =  _.cloneDeep(state);
    let bookMarkList:BookmarkList = {}
    _.cloneDeep(Bookmarks).forEach((bookmark)=>{
      let string = bookmark.jobUID + '-' + bookmark.userUID
      bookMarkList[string] = bookmark;
    })
    newState.Bookmarks = bookMarkList
    return {
      ...newState
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
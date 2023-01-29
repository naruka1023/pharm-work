import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import headerArray from 'src/app/model/data/uiKeys';
import { AppState, BookmarkList, filterConditions } from 'src/app/model/typescriptModel/jobPost.model';
import { addBookmark, emptyBookmark, getJobCategory, getJobs, removeBookmark, retrievedJobCategorySuccess, retrievedJobSuccess, retrievedUserBookmarkSuccess } from '../actions/job-post.actions';

// import { retrievedBookList } from './books.actions';
// import { Book } from '../book-list/books.model';

export const initialState: AppState = {
  loading: true,
  JobPost: [],
  Bookmarks: {}
};

export const jobPostReducer = createReducer(
  initialState,
  on(getJobs, (state) => state),
  // on(getJobCategory, (state) => state),
  on(removeBookmark, (state, {jobUID, userUID}) =>{
    let newState: AppState =  _.cloneDeep(state);
    let keys = jobUID + "-" + userUID
    delete newState.Bookmarks[keys];
    return {...newState}
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
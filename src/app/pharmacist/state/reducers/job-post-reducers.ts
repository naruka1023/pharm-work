import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import headerArray from '../../model/data/uiKeys';
import { AppState, BookmarkList, Follow } from '../../model/typescriptModel/jobPost.model';
import { addBookmark, removeBookmark, retrievedJobCategorySuccess, retrievedJobSuccess, retrievedUserBookmarkSuccess, updateFollowersList, addFollowers, removeFollowers, addJobRequest, EmptyJobPostAppState, removeJobRequest } from '../actions/job-post.actions';

// import { retrievedBookList } from './books.actions';
// import { Book } from '../book-list/books.model';

const emptyOperator = {
  email: '',
  role: '',
  uid: '',
  Location: {
    Province: "",
    District: '',
    Section: ''
  },
  jobType: '',
  companyName: '',
  contacts:{
    phone: '',
    email: '',
    line: '',
    facebook: '',
  },
  urgentJobs: [],
}
export const initialState: AppState = {
  loading: true,
  JobPost: headerArray,
  Bookmarks: {},
  JobRequests:{},
  Follows:{},
};
export const jobPostReducer = createReducer(
  initialState,
  on(removeBookmark, (state, {jobUID, userUID}) =>{
    let newState: AppState =  _.cloneDeep(state);
    let keys = jobUID + "-" + userUID
    delete newState.Bookmarks[keys];
    return {...newState}
  }),
  on(removeFollowers, (state, {userUID, operatorUID}) =>{
    let newState: AppState =  _.cloneDeep(state);
    let keys = userUID + "-" + operatorUID
    delete newState.Follows[keys];
    return {...newState}
  }),
  on(addFollowers, (state, {operator})=>{
    let newState: AppState =  _.cloneDeep(state);
    let keys = operator.userUID + "-" + operator.operatorUID
    newState.Follows[keys] = operator
    return {
      ...newState
    }
  }),
  on(updateFollowersList, (state, {followers}) =>{
    let newState: AppState =  _.cloneDeep(state);
    let newFollowers: any = {};
    followers.forEach((jr: Follow)=>{
      let keys = jr.userUID + '-' + jr.operatorUID
      newFollowers[keys] = {
        ...jr
      }
      
    })
    return {
      ...newState,
      Follows:newFollowers
      
    }
  }),
  on(addJobRequest, (state, {jobRequest})=>{
    let newState: AppState =  _.cloneDeep(state);
    let keys = jobRequest.jobUID + "-" + jobRequest.userUID
    newState.JobRequests[keys] = jobRequest
    return {
      ...newState
    }
  }),
  on(removeJobRequest, (state, {jobRequest}) =>{
    let newState: AppState =  _.cloneDeep(state);
    let keys = jobRequest.jobUID + "-" + jobRequest.userUID
    delete newState.JobRequests[keys];
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

  on(EmptyJobPostAppState, (state)=>{
    return {
      ...initialState
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
        newJob.count = jobs.count
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
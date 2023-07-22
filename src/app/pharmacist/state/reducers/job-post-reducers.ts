import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import headerArray from '../../model/data/uiKeys';
import { AppState, BookmarkList, Follow, filterConditions, userOperator } from '../../model/typescriptModel/jobPost.model';
import { addBookmark, removeBookmark, retrievedJobCategorySuccess, retrievedJobSuccess, retrievedUserBookmarkSuccess, updateFollowersList, addFollowers, removeFollowers, addJobRequest, EmptyJobPostAppState, removeJobRequest, updateJobFromJobCategory, retrievedJobCategoryHomeSuccess, updateJobFromHome, paginateJobCategory, setExistingOperatorData, toggleJobs } from '../actions/job-post.actions';

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
  on(toggleJobs, (state) =>{
    return state
  }),
  on(removeBookmark, (state, {jobUID, userUID}) =>{
    let newState: AppState =  _.cloneDeep(state);
    let keys = jobUID + "-" + userUID
    delete newState.Bookmarks[keys];
    return {...newState}
  }),
  on(updateJobFromHome, (state, {categorySymbol, jobUID, jobPayload}) =>{
    let newState: AppState =  _.cloneDeep(state);
    const categories = newState.JobPost.map((job)=>{
      if(job.CategorySymbol == categorySymbol){
        return {
          ...job,
          content: job?.content?.map((profile: any) =>{
            if(profile.custom_doc_id == jobUID){
              return jobPayload
            }else{
              return profile
            }
          })
        }
      }else{
        return job
      } 
    })          
    newState.JobPost = categories
    return {...newState}
  }),
  on(updateJobFromJobCategory, (state, {categorySymbol, jobUID, jobPayload}) =>{
    let newState: AppState =  _.cloneDeep(state);
    const categories = newState.JobPost.map((job)=>{
      if(job.CategorySymbol == categorySymbol){
        return {
          ...job,
          allContent: job?.allContent?.map((profile: any) =>{
            if(profile.custom_doc_id == jobUID){
              return jobPayload
            }else{
              return profile
            }
          })
        }
      }else{
        return job
      } 
    })          
    newState.JobPost = categories
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
  on(setExistingOperatorData, (state, { jobType, operatorUID, jobs, followers }) => {
    let newState: AppState =  _.cloneDeep(state);
    let categorySymbol = jobType == 'ร้านยาแบรนด์'? 'BA': 'CB'
    let formattedJobs: any = {}
    jobs.forEach((job)=>{
      formattedJobs[job.custom_doc_id] = job
    })
    let jobPost = newState.JobPost.map((filterCondition: filterConditions)=>{
      if(filterCondition.CategorySymbol == categorySymbol){
        let filterConditionPayload = filterCondition.content.map((user: userOperator)=>{
          if(user.uid == operatorUID){
            return {
              ...user,
              operatorJobs: formattedJobs,
              loadingOperator: false,
              followers: followers
            }
          }else{
            return user
          }
        })
        return {
          ...filterCondition,
          content: filterConditionPayload
        }
      }else{
        return filterCondition
      }
    })
    return {
      ...newState,
      JobPost: jobPost
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
  }),
  on(paginateJobCategory, (state:AppState, { jobs }) => {
    let newState: AppState =  _.cloneDeep(state);
    newState.JobPost = newState.JobPost.map((job) =>{
      let newJob = _.cloneDeep(job);
      if(job.CategorySymbol == jobs.CategorySymbol){
        newJob.allContent = newJob.allContent?.concat(jobs.JobsPost!) 
        newJob.count += jobs.count!
        return newJob;
      }
      return job;
    })
    return {
      ...newState,
    }
  }),
  on(retrievedJobCategoryHomeSuccess, (state:AppState, { jobs }) => {
    let newState: AppState =  _.cloneDeep(state);
    newState.JobPost = newState.JobPost.map((job) =>{
      let newJob = _.cloneDeep(job);
      if(job.CategorySymbol == jobs.CategorySymbol){
        newJob.content = jobs.JobsPost
        newJob.count = jobs.count!
        newJob.loading = false
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
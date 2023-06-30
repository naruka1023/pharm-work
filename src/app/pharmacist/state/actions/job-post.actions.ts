import { createAction, props } from '@ngrx/store';
import { jobPostModel, Bookmark, filterConditions, jobPostPayload, jobRequest, userOperator, Follow } from '../../model/typescriptModel/jobPost.model';

export const getJobCategory = createAction(
  '[Job-Post] Get Job Category',
  props<{ CategorySymbol: string }>()
  );

export const addBookmark = createAction(
  '[Job-Post] Add Bookmark',
  props<{ jobUID: string, userUID: string, bookmarkUID: string, JobPost: jobPostModel}>()
)

export const addFollowers = createAction(
  '[Job-Post] Add Followers',
  props<{ operator: Follow}>()
)

export const removeFollowers = createAction(
  '[Job-Post] Remove Followers',
  props<{ userUID: string; operatorUID: string}>()
)

export const addJobRequest = createAction(
  '[Job-Post] Add Job Request',
  props<{ jobRequest:jobRequest }>()
)

export const emptyRequestedJobs = createAction(
  '[Job-Post] Empty Requested Jobs'
)

export const getBookmarks = createAction(
  '[Job-Post] Get Bookmark',
  props<{ userUID: string}>()
)



export const EmptyJobPostAppState = createAction(
  '[Job-Post] Empty Job Post App State',
)

export const removeBookmark = createAction(
  '[Job-Post] Remove Bookmark',
  props<{ jobUID: string, userUID: string}>()
)

export const removeJobRequest = createAction(
  '[Job-Post] Remove Job Request',
  props<{ jobRequest: jobRequest}>()
)

export const retrievedUserBookmarkSuccess = createAction(
  '[Job-Post] Retrieve User Bookmark Success',
  props<{ Bookmarks: Bookmark[]}>()
)

export const followOperator = createAction(
  '[Job-Post] Follow Operator',
  props<{ follow:Follow }>()
)


export const updateFollowersList = createAction(
  '[Job-Post] Update Followers List',
  props<{ followers:Follow[] }>()
)

export const filterJobs = createAction(
  '[Job-Post] Filter Jobs',
  props<{ id: string; CategorySymbol: string }>()
  );
  
  export const retrievedJobSuccess = createAction(
  '[Job-Post] Retrieve Jobs Success',
  props<{ jobs: filterConditions[] }>()
  );

  
  export const updateJobFromJobCategory = createAction(
  '[Job-Post] Update Job From Job Category',
  props<{ categorySymbol: string, jobUID: string, jobPayload: jobPostModel }>()
  );

  export const setExistingOperatorData = createAction(
    '[Operator] Set Existing Operator Jobs',
    props<{ jobType: string, operatorUID: string, jobs: jobPostModel[], followers: number}>()
  );
  
  
  export const updateJobFromHome = createAction(
  '[Job-Post] Update Job From Home',
  props<{ categorySymbol: string, jobUID: string, jobPayload: jobPostModel }>()
  );

  
  export const toggleJobs = createAction(
  '[Job-Post] Toggle Jobs'
  );
  
  
  export const retrievedJobCategorySuccess = createAction(
  '[Job-Post] Retrieve Jobs Category Success',
  props<{ jobs: jobPostPayload }>()
  );
  
  
  export const paginateJobCategory = createAction(
  '[Job-Post] Paginate Job Category',
  props<{ jobs: jobPostPayload }>()
  );
  
  export const retrievedJobCategoryHomeSuccess = createAction(
  '[Job-Post] Retrieve Jobs Category Home Success',
  props<{ jobs: jobPostPayload }>()
  );
  
/*
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://github.com/ngrx/platform
*/
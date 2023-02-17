import { createAction, props } from '@ngrx/store';
import { jobPostModel, Bookmark, filterConditions, jobPostPayload, jobRequest } from '../../model/typescriptModel/jobPost.model';

export const getJobCategory = createAction(
  '[Job-Post] Get Job Category',
  props<{ CategorySymbol: string }>()
  );

export const addBookmark = createAction(
  '[Job-Post] Add Bookmark',
  props<{ jobUID: string, userUID: string, bookmarkUID: string, JobPost: jobPostModel}>()
)

export const getRequestedJobs = createAction(
  '[Job-Post] Get Requested Jobs',
  props<{ jobRequest:jobRequest[] }>()
)

export const emptyRequestedJobs = createAction(
  '[Job-Post] Empty Requested Jobs'
)

export const getBookmarks = createAction(
  '[Job-Post] Get Bookmark',
  props<{ userUID: string}>()
)



export const emptyBookmark = createAction(
  '[Job-Post] empty Bookmark',
)

export const removeBookmark = createAction(
  '[Job-Post] Remove Bookmark',
  props<{ jobUID: string, userUID: string}>()
)

export const retrievedUserBookmarkSuccess = createAction(
  '[Job-Post] Retrieve User Bookmark Success',
  props<{ Bookmarks: Bookmark[]}>()
)
  
  export const filterJobs = createAction(
    '[Job-Post] Filter Jobs',
    props<{ id: string; CategorySymbol: string }>()
    );
    
    export const retrievedJobSuccess = createAction(
    '[Job-Post] Retrieve Jobs Success',
    props<{ jobs: filterConditions[] }>()
    );
    
    export const retrievedJobCategorySuccess = createAction(
    '[Job-Post] Retrieve Jobs Category Success',
    props<{ jobs: jobPostPayload }>()
    );


/*
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://github.com/ngrx/platform
*/
import { createAction, props } from '@ngrx/store';
import { filterConditions, jobPostModel } from 'src/app/model/typescriptModel/jobPost.model';


export const getJobs = createAction(
  '[Job-Post] Get Jobs',
  );
  
export const getJobCategory = createAction(
  '[Job-Post] Get Job Category',
  props<{ CategorySymbol: string }>()
  );
  
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
    props<{ jobs: any }>()
    );


/*
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://github.com/ngrx/platform
*/
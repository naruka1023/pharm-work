import { createAction, props } from '@ngrx/store';
import { filterConditions } from 'src/app/model/typescriptModel/job-post-model/jobPost.model';

export const getJobs = createAction(
  '[Job-Post] Get Jobs',
  );
  
export const getJobProfile = createAction(
  '[Job-Post] Get Job Profile',
  props<{ id: string }>()
  );
  
  export const filterJobs = createAction(
    '[Job-Post] Filter Jobs',
    props<{ id: string; CategorySymbol: string }>()
    );
    
    export const retrievedJobSuccess = createAction(
    '[Job-Post] Retrieve Jobs Success',
    props<{ jobs: filterConditions[] }>()
);


/*
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://github.com/ngrx/platform
*/
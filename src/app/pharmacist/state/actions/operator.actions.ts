import { createAction, props } from '@ngrx/store';
import { jobPostModel, userOperator } from '../../model/typescriptModel/jobPost.model';

  
export const emptyOperatorData = createAction(
  '[Operator] Empty Operator Data'
);
  
export const setOperatorJobs = createAction(
  '[Operator] Set Operator Jobs',
  props<{ jobs: jobPostModel[]}>()
);

export const setOperatorData = createAction(
  '[Operator] Set Operator Data',
  props<{ operator: userOperator}>()
)

/*
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://github.com/ngrx/platform
*/
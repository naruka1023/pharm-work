import { createAction, props } from '@ngrx/store';
import { jobPostModel, userOperator } from '../../model/typescriptModel/jobPost.model';

  
export const emptyOperatorData = createAction(
  '[Job-Post] Empty Operator Data'
);

export const setOperatorData = createAction(
  '[Job-Post] Set Operator Data',
  props<{ operator: userOperator}>()
)

/*
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://github.com/ngrx/platform
*/
import { createAction, props } from '@ngrx/store';
import { jobPostModel } from '../../model/typescriptModel/jobPost.model';

  


export const getUrgentJobsSuccess = createAction(
  '[Urgent-Jobs] Get Urgent Jobs Success',
  props<{ jobs: jobPostModel[]}>()
)

export const emptyUrgentJobs = createAction(
  '[Urgent-Jobs] Empty Urgent Jobs',
)


/*
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://github.com/ngrx/platform
*/
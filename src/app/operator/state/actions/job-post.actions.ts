import { createAction, props } from "@ngrx/store";
import { jobPostModel, jobRequest } from "../../model/jobPost.model";

export const setJobActive = createAction(
    '[Job-Post] Set Job Active',
    props<{ jobID: string, active:boolean }>()
);
export const getCreatedJobsSuccess = createAction(
    '[Job-Post] Get Created Jobs Success',
    props<{ jobs: jobPostModel[] }>()
);
export const getRequestedJobs = createAction(
    '[Job-Post] Get Requested Jobs',
    props<{ jobRequest:jobRequest[] }>()
  )
export const emptyRequestedJobs = createAction(
'[Job-Post] Empty Requested Jobs'
)


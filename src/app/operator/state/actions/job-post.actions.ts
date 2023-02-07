import { createAction, props } from "@ngrx/store";
import { jobPostModel } from "../../model/jobPost.model";

export const removeJob = createAction(
    '[Job-Post] Remove Job',
    props<{ jobID: string }>()
);
export const editJob = createAction(
    '[Job-Post] Edit Job',
    props<{ job: jobPostModel }>()
);
export const setJobActive = createAction(
    '[Job-Post] Set Job Active',
    props<{ jobID: string, active:boolean }>()
);
export const getCreatedJobsSuccess = createAction(
    '[Job-Post] Get Created Jobs Success',
    props<{ jobs: jobPostModel[] }>()
);

    
import { createAction, props } from "@ngrx/store";
import { jobPostModel, jobRequest, JobRequestList, jobUIDForUser } from "../../model/jobPost.model";

export const getCreatedJobsSuccess = createAction(
    '[Job-Post] Get Created Jobs Success',
    props<{ jobs: jobPostModel[] }>()
);


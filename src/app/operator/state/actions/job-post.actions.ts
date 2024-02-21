import { createAction, props } from "@ngrx/store";
import { jobPostModel } from "../../model/jobPost.model";

export const getCreatedJobSuccess = createAction(
    '[Job-Post] Get Created Job Success',
    props<{ job: jobPostModel, docType:string }>()
);

export const toggleCreatedJobLoading = createAction(
    '[Job-Post] Toggle Created Job Loading',
);

export const toggleFirstNotificationJob = createAction(
    '[Job-Post] Toggle First Notification Job',
    props<{ jobUID:string }>()
);


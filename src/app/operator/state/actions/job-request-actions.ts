import { createAction, props } from "@ngrx/store";
import { jobPostModel, jobRequest, JobRequestList, jobUIDForUser } from "../../model/jobPost.model";

export const populateJobRequestWithUser = createAction(
    '[Job-Request] Populate Job Request With User',
    props<{ jobUIDForUser: jobUIDForUser }>()
);
export const setRequestedJobs = createAction(
    '[Job-Request] Set Requested Jobs',
    props<{ jobRequest:JobRequestList }>()
);
export const removeUserFromRequestedJob = createAction(
    '[Job-Request] Remove User From Requested Job',
    props<{ jobUIDForUser:jobUIDForUser }>()
);
export const populateJobRequestWithUsers = createAction(
    '[Job-Request] Populate Job Request With Users',
    props<{ jobUIDForUsers:jobUIDForUser }>()
);
export const toggleUserList = createAction(
    '[Job-Request] Toggle User List',
    props<{ jobUIDForUsers:jobUIDForUser }>()
);
export const toggleJobRequestLoadingFlag = createAction(
    '[Job-Request] Job Request Loading Flag',
);
export const emptyRequestedJobs = createAction(
'[Job-Request] Empty Requested Jobs'
)


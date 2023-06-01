import { createAction, props } from "@ngrx/store"
import { jobPostModel } from "../../model/typescriptModel/jobPost.model"

export const addRecentlySeen = createAction(
    '[Recently-Seen] Add Recently Seen',
    props<{ JobPost: jobPostModel }>()
  )
  
  export const removeRecentlySeen = createAction(
    '[Recently-Seen] Remove Recently Seen',
  )
  
  export const filterRecentlySeen = createAction(
    '[Recently-Seen] Filter recently seen',
  )
    
  export const updateRecentlySeenJob = createAction(
    '[Recently-Seen] Update Recently Seen Job',
    props<{ jobUID: string, JobPost: jobPostModel }>()
    );
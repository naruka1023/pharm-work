import { createAction, props } from "@ngrx/store"
import { jobPostModel, Bookmark } from "src/app/model/typescriptModel/jobPost.model"

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
    
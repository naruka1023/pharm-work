import { createAction, props } from "@ngrx/store"
import { UserPharma } from "../../model/user.model"

export const addRecentlySeen = createAction(
    '[Recently-Seen] Add Recently Seen',
    props<{ user: UserPharma }>()
  )
  
  export const removeRecentlySeen = createAction(
    '[Recently-Seen] Remove Recently Seen',
  )
  
  export const filterRecentlySeen = createAction(
    '[Recently-Seen] Filter recently seen',
  )
    
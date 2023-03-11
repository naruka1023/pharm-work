import { createAction, props } from "@ngrx/store"

export const setURL = createAction(
    '[Operator Profile] set Inner URL',
    props<{ url: string }>()
  )
  
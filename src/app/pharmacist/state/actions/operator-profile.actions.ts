import { createAction, props } from "@ngrx/store"

export const setURL = createAction(
    '[Pharma Profile] set Inner URL',
    props<{ url: string }>()
  )
  
import { createAction, props } from "@ngrx/store"
import { requestView, requestViewList } from "../../model/user.model"

export const addRequestView = createAction(
    '[Request-View] Add Request View',
    props<{ requestView: requestView }>()
  )

export const removeRequestView = createAction(
    '[Request-View] Remove Request View',
    props<{ requestView: requestView }>()
  )
  
  export const setRequestView = createAction(
      '[Request-View] Set Request View',
      props<{ requestViewList: requestViewList }>()
    )
  
  export const modifyRequestView = createAction(
      '[Request-View] Modify Request View',
      props<{ requestView: requestView }>()
    )

  
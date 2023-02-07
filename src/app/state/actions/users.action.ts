import { createAction, props } from "@ngrx/store";
import { User } from "../../pharmacist/model/typescriptModel/users.model";

export const getCurrentUser = createAction(
    '[User] get Current User',
    props<{ uid: string }>()
);
export const setCurrentUser = createAction(
    '[User] set Current User',
    props<{ user: User }>()
);
export const removeCurrentUser = createAction(
    '[User] remove Current User',
);
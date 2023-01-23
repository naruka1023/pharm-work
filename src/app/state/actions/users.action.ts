import { createAction, props } from "@ngrx/store";
import { User } from "src/app/model/typescriptModel/users.model";

export const setCurrentUser = createAction(
    '[User] set Current User',
    props<{ userState: User }>()
);
export const removeCurrentUser = createAction(
    '[User] remove Current User',
);
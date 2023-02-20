import { createAction, props } from "@ngrx/store";
import { UserPharma } from "../../model/user.model";

export const funnelUsers = createAction(
    '[Pharma-Users] Funnel Users',
    props<{ users: UserPharma[] }>()
);
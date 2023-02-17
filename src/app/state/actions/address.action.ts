import { createAction } from "@ngrx/store";

export const removeDefaultKey = createAction(
    '[Address] Remove Default Key',
);

export const toggleAddressChange = createAction(
    '[Address] Toggle Address Change',
);

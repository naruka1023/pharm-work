import { createAction, props } from "@ngrx/store";
import { Favorite, UserPharma } from "../../model/user.model";

export const toggleLoading = createAction(
    '[Pharma-Users] Toggle Loading'
);

export const funnelUsers = createAction(
    '[Pharma-Users] Funnel Users',
    props<{ users: UserPharma[] }>()
);

export const addFavorites = createAction(
    '[Pharma-Users] Add Favorites',
    props<{ operatorUID: string, user:UserPharma, favoriteUID: string }>()
);

export const removeFavorite = createAction(
    '[Pharma-Users] Remove Favorites',
    props<{ operatorUID: string, userUID: string }>()
);


export const clearFavorites = createAction(
    '[Pharma-Users] Clear Favorites',
);

export const setFavorites = createAction(
    '[Pharma-Users] Set Favorites',
    props<{ favorites: Favorite[]}>()
);

export const SetUsersByJobType = createAction(
    '[Pharma-Users] Set Users By Job Type',
    props<{ users: UserPharma[], jobType: string }>()
);
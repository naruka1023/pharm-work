import { createAction, props } from "@ngrx/store";
import { Favorite, UserPharma } from "../../model/user.model";

export const toggleLoading = createAction(
    '[Pharma-Users] Toggle Loading'
);
export const coverPhotoLoadingComplete = createAction(
    '[Pharma-Users] Cover Photo Loading Complete',
    props<{ userUID: string }>()
);

export const funnelUsers = createAction(
    '[Pharma-Users] Funnel Users',
    props<{ allUsers: { [key: string]: { [key:string]: UserPharma } } }>() 
);

export const modifyUser = createAction(
    '[Pharma-Users] Modify User',
    props<{ categoryService: string; user: UserPharma }>() 
);

export const removeUser = createAction(
    '[Pharma-Users] Remove User',
    props<{ categoryService: string; user: UserPharma }>() 
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

export const updateUsersByJobType = createAction(
    '[Pharma-Users] Update Users By Job Type',
    props<{ users: UserPharma[], jobType: string }>()
);
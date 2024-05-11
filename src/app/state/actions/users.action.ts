import { createAction, props } from "@ngrx/store";
import { User } from "src/app/model/user.model";

export const getCurrentUser = createAction(
    '[User] get Current User',
    props<{ uid: string }>()
);
export const updatePackage = createAction(
    '[User] Update Package',
    props<{ packageFlag: string, payload: {
        name: string, description: string, price: string, priceID: string
    } }>()
);
export const setCurrentUser = createAction(
    '[User] Set Current User',
    props<{ user: Partial<User> }>()
);
export const upgradeToPharma = createAction(
    '[User] Upgrade to Pharma',
    props<{ license: string }>()
);
export const toggleLoading = createAction(
    '[User] Toggle Loading',
);
export const removeCurrentUser = createAction(
    '[User] remove Current User',
);
export const coverPhotoLoadSuccessful = createAction(
    '[User] Cover Photo Load Successful',
);
export const updateCoverPhotoOffset = createAction(
    '[User] Update Cover Photo Offset',
    props<{ offset: number }>()
);
export const updateCoverPhoto = createAction(
    '[User] Update Cover Photo',
    props<{ coverPhotoPictureUrl: string, offset: number }>()
);
export const updateProfilePicture = createAction(
    '[User] Update Profile Picture',
    props <{profilePictureUrl: string }>()
)
export const updateCropProfilePicture = createAction(
    '[User] Update Crop Profile Picture',
    props <{cropProfilePictureUrl: string }>()
)
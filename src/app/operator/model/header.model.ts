export interface profileHeaderJobPost {
    Establishment: string;
    JobType: string;
    profilePictureUrl?:string,
    coverPhotoPictureUrl?:string,
    coverPhotoOffset?: number,
    cropProfilePictureUrl?: string,
}

export interface profileHeaderOperator {
    name: string;
    JobType: string;
    profilePictureUrl?:string,
    coverPhotoPictureUrl?:string,
    coverPhotoOffset?: number,
    cropProfilePictureUrl?: string,
    Location?: {
        Section: string;
        District: string;
        Province: string
    }
}
export interface profileHeaderPharma {
    name: string;
    profilePictureUrl?:string,
    coverPhotoPictureUrl?:string,
    coverPhotoOffset?: number,
    cropProfilePictureUrl?: string,
    Location?: {
        Section: string;
        District: string;
        Province: string
    }
}

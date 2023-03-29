export interface profileHeaderJobPost {
    Establishment: string;
    JobType: string;
}

export interface profileHeaderOperator {
    name: string;
    JobType: string;
    Location?: {
        Section: string;
        District: string;
        Province: string
    }
}


export interface profileHeaderPharma {
    name: string;
    Location?: {
        Section: string;
        District: string;
        Province: string
    }
    coverPhotoOffset: number
}

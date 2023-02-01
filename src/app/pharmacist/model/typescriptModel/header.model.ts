export interface profileHeaderJobPost {
    Establishment: string;
    JobType: string;
}

export interface profileHeaderPharma {
    name: string;
    Location?: {
        Section: string;
        District: string;
        Province: string
    }
}

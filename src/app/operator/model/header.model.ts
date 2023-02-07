export interface profileHeaderJobPost {
    Establishment: string;
    JobType: string;
}

export interface profileHeaderOperator {
    name: string;
    Location?: {
        Section: string;
        District: string;
        Province: string
    }
}

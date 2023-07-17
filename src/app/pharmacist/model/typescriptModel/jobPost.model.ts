export interface filterConditions{
    dateFilter?: boolean;
    CategorySymbol: string;
    brandToCategory?: string;
    filterFlag?: boolean;
    header: string;
    count: number;
    loading: boolean;
    allContent?: jobPostModel[];
    content?: any
}


export interface BookmarkList{
    [key: string]: Bookmark
}

export interface Bookmark{
    jobUID: string,
    userUID: string,
    bookmarkUID: string
    JobPost?: jobPostModel
}
export interface Follow{
    userUID:string;
    operatorUID: string;
    followUID?: string;
    user?:userOperator
}
export interface userOperator{
    email: string,
    companyName?: string,
    jobType?: string,
    companyID?: string,
    companySize: string,
    coverPhotoOffset?: number,
    areaOfContact?: string,
    productsAndServices: string,
    loadingOperator?: boolean,
    TravelInstructions: string,
    _geolocCurrent?: _geoloc;
    profilePictureUrl?:string,
    operatorJobs?: jobPostModel[],
    benefits: string,
    cropProfilePictureUrl?: string,
    followers: number,
    numberOfUrgent?: number,
    numberOfNormal?: number,
    coverPhotoPictureUrl?:string
    nameOfPerson?: string,
    phoneNumber?: string,
    emailRepresentative?: string,
    _geoloc?:_geoloc,
    role: string,
    contacts?: operatorContacts
    Location?: {
        address?: string;
        Section: string;
        District: string;
        Province: string;
    },
    uid: string;
}

export interface operatorContacts{
    areaOfContact: string;
    phone: string;
    email: string;
    line: string;
    website: string;
    facebook: string;
    twitter: string;
    skype: string;
    youtube: string;
}

export interface Contacts{
    phone: string;
    email: string;
    line: string;
    facebook: string;
}

export interface AppState {
    loading: boolean;    
    JobPost: filterConditions[];
    Bookmarks: BookmarkList;
    Follows: FollowList;
    JobRequests: JobRequestList;
}

export interface JobRequestList{
    [key: string]: jobRequest
}

export interface FollowList{
    [key: string]: Follow
}

export interface JobSearchForm{
    DateOfJob?: Date[];
    orderBy?: string;
    TimeFrame?: string;
    Salary?: string;
    OnlineInterview?: boolean;
    _geoloc?: _geoloc
    nearbyFlag?: boolean
    radius?: number | string
    Location: {
        District: string;
        Section: string;
        Province: string
    };
    MRT: string;
    BTS: string
}

export interface jobRequest {
    custom_doc_id?: string
    JobPost?: jobPostModel
    operatorUID: string,
    userUID: string,
    jobUID: string
}

export interface jobPostPayload {
    CategorySymbol: string;
    JobsPost?: jobPostModel[];
    UserOperator?: userOperator[];
    count?: number
}

export interface jobPostModel {
    Amount: string;
    CategorySymbol: string;
    BTS: {
        Near: boolean;
        Station: string;
    };
    Establishment: string;
    Franchise: string;
    JobName: string;
    JobType: string;
    Location: {
        Section: string;
        District: string;
        Province: string;
    };
    MRT: {
        Near: false;
        Station: string;
    };
    SRT: {
        Near: false;
        Station: string;
    };
    ARL: {
        Near: false;
        Station: string;
    };
    OnlineInterview: boolean;
    WorkFromHome: boolean;
    Salary: {
        Amount: number;
        Cap: number;
        Suffix: string
    };
    Contacts: {
        nameRepresentative: string,
        areaOfContact: string,
        phone: string;
        email: string;
        line: string;
        website: string;
        facebook: string;
    },
    JobDetails: string,
    TravelInstructions: string,
    qualityApplicants: string,
    jobBenefits: string,
    applyInstructions: string,
    OperatorUID: string;
    TimeFrame: string;
    Urgency: boolean;
    Duration: string;
    Active:boolean;
    DateOfJob: Date [];
    _geoloc?: _geoloc;
    dateCreated: string;
    dateUpdated: string;
    dateUpdatedUnix: number;
    custom_doc_id: string;
    cropProfilePictureUrl?: string;
    profilePictureUrl?:string;
    coverPhotoPictureUrl?:string
}

export interface _geoloc{
    lat: number, 
    lng: number
}
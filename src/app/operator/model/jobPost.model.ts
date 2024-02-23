import { UserPharma } from "./user.model";

export interface jobPostModel {
    Amount: number;
    CategorySymbol: string;
    BTS: {
        Near: boolean;
        Station: string;
    };
    type?: any;
    Establishment: string;
    Franchise: string;
    JobName: string;
    JobType: string;
    firstNotificationFlag?: boolean
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
        Cap?: number;
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
    profilePictureUrl?: string;
    cropProfilePictureUrl?: string,
    _geoloc: _geoloc,
    coverPhotoPictureUrl?: string,
    coverPhotoOffset?: number,
    TimeFrame: string;
    Urgency: boolean;
    Active: boolean;
    Duration: string;
    DateOfJob: string | Date [];
    dateCreated: string;
    dateUpdated: string;
    dateUpdatedUnix: number;
    custom_doc_id: string
}
export interface _geoloc {
    lat: number;
    lng: number
}
export interface jobUIDForUser{
    userList?: {
        [key:string]:UserPharma
    },
    user?: UserPharma,
    userArray?:string[],
    jobUID: string,
    flag?: boolean
}
export interface JobRequestList{
    [key: string]: collatedJobRequest
}

export interface collatedJobRequest {
    jobRequest: jobRequest,
    flag: boolean,
    users: {
        [key:string]:UserPharma
    },
    jobUID: string
}

export interface jobRequest {
    type?: string,
    custom_doc_id?: string
    operatorUID: string,
    userUID: string,
    jobUID: string
}

export interface AppState{
    JobPost: jobPostModel[],
    loading: boolean,
}

export interface AppStateJobRequest{
    loadingRequest:boolean,
    JobRequests: JobRequestList
}
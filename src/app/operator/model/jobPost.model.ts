import { UserPharma } from "./user.model";

export interface jobPostModel {
    Amount: 2;
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
        Amount: string;
        Suffix: string
    };
    Contacts: {
        phone: string,
        email: string,
        line: string,
        facebook: string
    },
    JobDetails: string,
    TravelInstructions: string,
    qualityApplicants: string,
    jobBenefits: string,
    applyInstructions: string,
    OperatorUID: string;
    TimeFrame: string;
    Urgency: boolean;
    Active: boolean;
    Duration: string;
    DateOfJob: Date [];
    dateCreated: string;
    dateUpdated: string;
    custom_doc_id: string
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
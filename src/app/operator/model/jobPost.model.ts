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

export interface JobRequestList{
    [key: string]: jobRequest
}


export interface jobRequest {
    custom_doc_id?: string
    JobPost?: jobPostModel
    operatorUID: string,
    userUID: string,
    jobUID: string
}

export interface AppState{
    JobPost: jobPostModel[],
    loading: boolean,
    JobRequests: JobRequestList
}
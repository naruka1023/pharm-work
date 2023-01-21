export interface filterConditions{
    dateFilter?: boolean;
    JobType?: boolean;
    CategorySymbol: string;
    JobTypeTwo?: boolean
    timeFrame?: boolean; 
    location?: boolean;
    brandToCategory?: string;
    filterFlag?: boolean;
    header: string;
    allContent?: jobPostModel [];
    content?: jobPostModel []
}

export interface AppState{
    loading: boolean;
    loginState: boolean;
    JobPost: filterConditions []
}

export interface jobPostPayload {
    CategorySymbol: string;
    JobPostModel: jobPostModel [];
}

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
    OnlineInterview: true;
    Salary: string;
    TimeFrame: string;
    Urgency: true;
    Duration: string;
    DateOfJob: string;
    dateCreated: string;
    dateUpdated: string;
    custom_doc_id: string
}
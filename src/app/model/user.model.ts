export interface JobHistory 
{
    jobName: string;
    companyName: string;
    dateStarted: string;
    activeFlag: string;
    workExperience: any;
    dateEnded: string;
    description: string;
}

export interface _geoloc{
    lat: number,
    lng: number
}

export interface Location
{
    address?: string;
    Section: string;
    District: string;
    Province: string;
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

export interface User{
    role: string;
    email: string;
    uid: string;
    license: string;
    gender?: string;
    education?: string;
    birthday?: string;
    age?: string;
    _geoloc?: _geoloc;
    _geolocCurrent?: _geoloc;
    showProfileFlag: boolean;
    contacts?: {
        phone: string;
        email: string;
        line: string;
        facebook: string;
    }
    name: string;
    surname: string;
    Location?: Location,
    active?:string;
    educationHistory?: {
        universityName: string;
        franchise: string;
        yearGraduated: string;
        educationLevel: string;
        major: string;
    } [],
    otherSkills?: string;
    urgentTimeFrame: string;
    urgentPreferredDay: string[];
    preferredUrgentLocation: Location;
    preferredUrgentProvince?: string;
    preferredUrgentDistrict?: string;
    preferredUrgentSection?: string;
    urgentDescription: string;
    skills?: {
        word: string;
        excel: string;
        powerpoint: string;
    };
    englishComprehension?: {
        listening: string;
        reading: string;
        speaking: string;
        writing: string;
    };
    jobHistory?: JobHistory[],
    loading: boolean,
    preferredJobType?:string[],
    preferredTimeFrame?: string,
    preferredLocation?: Location,
    preferredAddress?: string,
    preferredProvince?:string,
    preferredDistrict?:string,
    preferredSection?:string,
    preferredStartTime?: string,
    preferredSalary?: string,
    AmountCompleted: number,
    WorkExperience:number,
    yearFlag: boolean,
    highestEducation: string,
    profilePictureUrl?:string,
    coverPhotoOffset?: number,
    coverPhotoPictureUrl?:string
    dateUpdated: string,
    coverPhotoFlag: boolean,
    introText: string,
    nickName: string,
    cropProfilePictureUrl?: string,
}
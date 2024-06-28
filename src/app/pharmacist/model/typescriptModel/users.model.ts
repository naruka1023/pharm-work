import { jobPostModel, userOperator } from "./jobPost.model";

export interface registerFormOperator{
    email: string,
    password?: string,
    confirmPassword?: string,
    companyName: string,
    jobType: string,
    companyID: string,
    nameOfPerson: string,
    phoneNumber: string,
    role: string
}
export interface aggregationCount{
    jobCount: number;
    userPharmaCount: number;
    userOperatorCount: number
}
export interface registerFormPharmacist{
    email: string,
    password?: string,
    confirmPassword?: string,
    name: string,
    surname: string,
    license: string,
    role: string,
    showProfileFlag: boolean,
    preferredJobType:string[],
    preferredTimeFrame: string,
    preferredLocation: Location,
    preferredStartTime: string,
    preferredSalary: string,
    AmountCompleted: number,
    WorkExperience:number
}

export interface requestViewList {
    [key: string]: requestView
}
export interface notifications{
    job:{
        content: jobPostModel,
        loading: boolean
    },
    size: string,
    notificationsArchive: {
        [key: string]: notificationContent
    }
}
export interface notificationContent{
    dateCreated: string,
    dateRange?: string,
    title: string,
    notificationID: string,
    image: string,
    dateCreatedUnix: string,
    userUID: string,
    body: string,
    url: string,
    newFlag?: boolean
}
export interface requestViewState{
    payload: requestView;
    type: string
}

export interface requestView
{
    operatorUID: string;
    userUID: string;
    requestView: string
    dateSent: string
    requestViewUID?: string;
    content?: userOperator
    status: string
}

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

export interface Location
{
    address?: string;
    Section: string;
    District: string;
    Province: string;
}

export interface _geoloc{
    lat: number;
    lng: number    
}

export interface User{
    role: string;
    email: string;
    uid: string;
    license: string;
    gender?: string;
    education?: string;
    studentFlag: boolean;
    birthday?: string;
    age?: string;
    _geoloc?: _geoloc;
    _geolocCurrent?: _geoloc;
    requestChangeStatus?: any;
    showProfileFlag: boolean;
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
    introText: string,
    nickName: string,
    cropProfilePictureUrl?: string,
}
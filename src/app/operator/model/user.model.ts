
export interface User{
    email: string,
    companyName?: string,
    jobType?: string,
    companyID?: string,
    companySize: string,
    coverPhotoOffset?: number,    
    productsAndServices: string,
    operatorBanners?: { [key:string]:string}
    TravelInstructions: string,
    _geolocCurrent?: _geoloc;
    profilePictureUrl?:string,
    showProfileFlag: boolean;
    benefits: string,
    cropProfilePictureUrl?: string,
    followers: number,
    coverPhotoPictureUrl?:string
    nameOfPerson?: string,
    phoneNumber?: string,
    emailRepresentative?: string,
    _geoloc:_geoloc,
    role: string,
    contacts?: Contacts
    Location?: {
        address?: string;
        Section: string;
        District: string;
        Province: string;
    },
    uid: string;
}

export interface notifications{
    user:{
        content: UserPharma,
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

export interface aggregationCount{
    jobCount: number;
    userPharmaCount: number;
    userOperatorCount: number
}

export interface Location
{
    address?: string;
    Section: string;
    District: string;
    Province: string;
}

export interface UserSearchForm 
{
    TimeFrame: string,
    WorkExperience: string,
    preferredLocation:Location,
    preferredStartTime?: string,
    preferredJobType?: string,
    active: string,
    
}

export interface UserUrgentSearchForm 
{
    amountCompletedSort: string,
    preferredUrgentLocation: Location;
    urgentTimeFrame: string;
    urgentPreferredDay: string;
    highestEducation: string;
    nearbyFlag: boolean,
    _geoloc?: _geoloc
    onlineFlag?:boolean,
    radius: string | number,
}

export interface _geoloc{
    lat: number;
    lng: number
}

export interface UserPharma{
    role: string;
    email: string;
    uid: string;
    license: string;
    objectID?: string;
    _geoloc?: _geoloc;
    requestChangeStatus?: any;
    gender?: string;
    education?: string;
    birthday?: string;
    age?: string;
    soleJobType?: string;
    showProfileFlag: boolean;
    contacts?: {
        phone: string;
        email: string;
        line: string;
        facebook: string;
    }
    urgentTimeFrame: string;
    urgentPreferredDay: string[];
    preferredUrgentLocation: Location;
    preferredUrgentProvince?: string;
    preferredUrgentDistrict?: string;
    preferredUrgentSection?: string;
    urgentDescription: string;
    otherSkills?: string;
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
    requestUID?: string,
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
    introText: string,
    dateUpdated: string,
    dateUpdatedUnix: number,
    nickName: string,
    cropProfilePictureUrl?: string,
}

export interface requestView
{
    operatorUID: string;
    userUID: string;
    requestView: string
    dateSent: string
    requestViewUID?: string;
    content?: UserPharma
    status: string
}

export interface requestViewState
{
    payload: requestView;
    type: string
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
export interface Favorite{
    operatorUID: string;
    userUID: string;
    favoriteUID: string;
    content?: UserPharma
}
export interface UsersByType{
    S:  {
        short:userPharmaList,
        long: userPharmaList
    },
    AA: {
        short:userPharmaList,
        long: userPharmaList
    },
    AB: {
        short:userPharmaList,
        long: userPharmaList
    },
    AC: {
        short:userPharmaList,
        long: userPharmaList
    },
    BA: {
        short:userPharmaList,
        long: userPharmaList
    },
    BB: {
        short:userPharmaList,
        long: userPharmaList
    },
    BC: {
        short:userPharmaList,
        long: userPharmaList
    },
    CA: {
        short:userPharmaList,
        long: userPharmaList
    },
    CB: {
        short:userPharmaList,
        long:userPharmaList
    },
}

export interface userPharmaList{
    [key:string]: UserPharma
}

export interface FavoriteList{
    [key: string]: Favorite
}

export interface requestViewList{
    [key: string]: requestView
}



export interface AppState{
    users: UsersByType;
    loading:boolean;
    Favorites: FavoriteList
}

export interface Contacts{
    areaOfContact: string,
    phone: string;
    email: string;
    line: string;
    nameRepresentative: string;
    website: string;
    facebook: string;
    twitter: string;
    skype: string;
    youtube: string;
}
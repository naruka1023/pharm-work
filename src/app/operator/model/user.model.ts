export interface User{
    email: string,
    companyName?: string,
    jobType?: string,
    companyID?: string,
    companySize: string,
    coverPhotoOffset?: number,
    productsAndServices: string,
    TravelInstructions: string,
    profilePictureUrl?:string,
    benefits: string,
    cropProfilePictureUrl?: string,
    coverPhotoPictureUrl?:string
    nameOfPerson?: string,
    phoneNumber?: string,
    emailRepresentative?: string,
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
    preferredJobType?: string
}

export interface UserPharma{
    role: string;
    email: string;
    uid: string;
    license: string;
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
    highestEducation: string,
    profilePictureUrl?:string,
    coverPhotoOffset?: number,
    coverPhotoPictureUrl?:string
    introText: string,
    dateUpdated: string,
    nickName: string,
    cropProfilePictureUrl?: string,
}

export interface JobHistory 
{
    jobName: string;
    companyName: string;
    dateStarted: string;
    activeFlag: string;
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



export interface AppState{
    users: UsersByType;
    loading:boolean;
    Favorites: FavoriteList
}

export interface Contacts{
    phone: string;
    email: string;
    line: string;
    website: string;
    facebook: string;
    twitter: string;
    skype: string;
    youtube: string;
}
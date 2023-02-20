export interface User{
    email: string,
    companyName?: string,
    jobType?: string,
    companyID?: string,
    nameOfPerson?: string,
    phoneNumber?: string,
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

export interface UserPharma{
    role: string;
    email: string;
    uid: string;
    license: string;
    gender?: string;
    education?: string;
    birthday?: string;
    age?: string;
    educationLevel?: string;
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
    } [],
    jobHistory?: {
        jobName: string;
        companyName: string;
        dateStarted: string;
        activeFlag: string;
        dateEnded: string;
        description: string;
    } [],
    loading: boolean,
    preferredJobType:string[],
    preferredTimeFrame?: string,
    preferredLocation?: Location,
    preferredStartTime?: string,
    preferredSalary?: string,
    AmountCompleted: number
}

export interface UsersByType{
    S:  {
        short:UserPharma[],
        long: UserPharma[]
    },
    AA: {
        short:UserPharma[],
        long: UserPharma[]
    },
    AB: {
        short:UserPharma[],
        long: UserPharma[]
    },
    AC: {
        short:UserPharma[],
        long: UserPharma[]
    },
    BA: {
        short:UserPharma[],
        long: UserPharma[]
    },
    BB: {
        short:UserPharma[],
        long: UserPharma[]
    },
    BC: {
        short:UserPharma[],
        long: UserPharma[]
    },
    CA: {
        short:UserPharma[],
        long: UserPharma[]
    },
    CB: {
        short:UserPharma[],
        long: UserPharma[]
    },
}

export interface AppState{
    users: UsersByType;
    loading:boolean
}

export interface Contacts{
    phone: string;
    email: string;
    line: string;
    facebook: string;
}
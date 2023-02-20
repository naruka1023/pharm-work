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
    AmountCompleted: number
}

export interface Location
{
    address?: string;
    Section: string;
    District: string;
    Province: string;
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
    preferredJobType?:string[],
    preferredTimeFrame?: string,
    preferredLocation?: Location,
    preferredStartTime?: string,
    preferredSalary?: string,
    AmountCompleted: number
}
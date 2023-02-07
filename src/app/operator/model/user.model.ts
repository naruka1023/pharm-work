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

export interface Contacts{
    phone: string;
    email: string;
    line: string;
    facebook: string;
}
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
    role: string
}

export interface User{
    role: string;
    email: string;
    companyName?: string
    name?: string;
    surname?: string;
    Location: {
        Section: string;
        District: string;
        Province: string;
    }
}
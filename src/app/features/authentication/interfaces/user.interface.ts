export interface IUser {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gender?: "M" | "F";
}

export interface ILoginCredentials {
    email: string;
    password: string;
}
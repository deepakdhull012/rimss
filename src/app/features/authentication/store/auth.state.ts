import { IUser } from "../interfaces/user.interface";

export interface IAuthState {
    isLoggedIn: boolean;
    signUpStatus?: boolean;
    user?: IUser
}
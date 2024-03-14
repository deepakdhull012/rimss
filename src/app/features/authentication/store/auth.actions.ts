import { createAction, props } from '@ngrx/store';
import { ILoginCredentials, IUser } from '../interfaces/user.interface';

export const signUp = createAction('[Auth] Signup', props<{ user: IUser }>());

export const login = createAction(
  '[Auth] Login',
  props<{ credentials: ILoginCredentials }>()
);

export const updateLoginStatus = createAction(
  '[Auth] Update Login Status',
  props<{ isLoggedIn: boolean }>()
);

export const updateSignupStatus = createAction(
  '[Auth] Update Signup Status',
  props<{ signupStatus: boolean }>()
);

export const fetchUserDetails = createAction(
  '[Auth] Fetch User Details',
  props<{ userId: number }>()
);

export const setUserDetails = createAction(
  '[Auth] Set User Details',
  props<{ user: IUser }>()
);

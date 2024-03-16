import { createAction, props } from '@ngrx/store';
import { ILoginCredentials, IUser } from '../interfaces/user.interface';

export const signUp = createAction('[Auth] Signup', props<{ user: IUser }>());

export const login = createAction(
  '[Auth] Login',
  props<{ credentials: ILoginCredentials }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success'
);

export const loginFail = createAction(
  '[Auth] Login Fail'
);

export const signUpSuccess = createAction(
  '[Auth] Signup success',
  props<{ signupStatus: boolean }>()
);

export const signUpFail = createAction(
  '[Auth] Sign up fail',
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

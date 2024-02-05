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

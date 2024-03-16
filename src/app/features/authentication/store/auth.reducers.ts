import { createReducer, on } from '@ngrx/store';
import { IAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authFeatureKey = 'authState';
export const intialAuthState: IAuthState = {
  user: localStorage.getItem('loggedInUser')
    ? JSON.parse(localStorage.getItem('loggedInUser') as string)
    : null,
  isLoggedIn: !!localStorage.getItem('loggedInUser'),
};

export const authReducer = createReducer(
  intialAuthState,

  on(AuthActions.loginSuccess, (state) => {
    return {
      ...state,
      isLoggedIn: true,
    };
  }),
  on(AuthActions.loginFail, (state) => {
    return {
      ...state,
      isLoggedIn: false,
    };
  }),
  on(AuthActions.signUpSuccess, (state) => {
    return {
      ...state,
      signUpStatus: true,
    };
  }),
  on(AuthActions.signUpFail, (state) => {
    return {
      ...state,
      signUpStatus: false,
    };
  }),
  on(AuthActions.setUserDetails, (state, payload) => {
    return {
      ...state,
      user: payload.user,
    };
  })
);

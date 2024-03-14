import { createReducer, on } from '@ngrx/store';
import { IAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authFeatureKey = 'authState';
export const intialAuthState: IAuthState = {
  user: localStorage.getItem('loggedInUser') ? JSON.parse(localStorage.getItem('loggedInUser') as string) : null,
  isLoggedIn: !!localStorage.getItem('loggedInUser'),
};

export const authReducer = createReducer(
  intialAuthState,

  on(AuthActions.updateLoginStatus, (state, payload) => {
    return ({
      ...state,
      isLoggedIn: payload.isLoggedIn,
    })
  }),
  on(AuthActions.updateSignupStatus, (state, payload) => {
    return ({
      ...state,
      signUpStatus: payload.signupStatus,
    })
  }),
  on(AuthActions.setUserDetails, (state, payload) => {
    return ({
      ...state,
      user: payload.user,
    })
  })
);

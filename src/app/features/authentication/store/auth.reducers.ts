import { createReducer, on } from '@ngrx/store';
import { IAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authFeatureKey = 'authState';
export const intialAuthState: IAuthState = {
  isLoggedIn: !!localStorage.getItem('loggedInUser'),
};

export const authReducer = createReducer(
  intialAuthState,
  on(AuthActions.updateLoginStatus, (state, payload) => {
    return ({
      ...state,
      isLoggedIn: payload.isLoggedIn,
    })
  })
);

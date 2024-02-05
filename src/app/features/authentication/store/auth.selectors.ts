import { createSelector } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import { IAuthState } from './auth.state';

export const selectAuthState = (state: IAppState) => state.authState;

export const selectLoginStatus = createSelector(
  selectAuthState,
  (state: IAuthState) => state.isLoggedIn
);

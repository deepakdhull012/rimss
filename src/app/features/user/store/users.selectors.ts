import { createSelector } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import { IUserState } from './users.state';

export const selectUserState = (state: IAppState) => state.userState;

export const selectAddresses = createSelector(
  selectUserState,
  (state: IUserState) => state.addresses
);

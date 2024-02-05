import { createReducer, on } from '@ngrx/store';
import { IUserState } from './users.state';
import * as UserActions from './users.actions';

export const userFeatureKey = 'userState';
export const intialUserState: IUserState = {
  addresses: []
};

export const userReducer = createReducer(
  intialUserState,
  on(UserActions.loadAddresses, (state, payload) => ({
    ...state,
    addresses: payload.addresses,
  }))
);

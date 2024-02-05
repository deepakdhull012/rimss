import { createAction, props } from '@ngrx/store';
import { IAddress } from '../interfaces/profile.interface';

export const createAddress = createAction(
  '[Users] Create Address',
  props<{ address: IAddress }>()
);

export const updateAddress = createAction(
  '[Users] Update Address',
  props<{ address: IAddress }>()
);

export const deleteAddress = createAction(
  '[Users] Delete Address',
  props<{ addressId: number }>()
);

export const fetchAddresses = createAction('[Users] Fetch Address');

export const makePrimaryAddress = createAction(
  '[Users] Make Primary Address',
  props<{ addressId: number }>()
);

export const loadAddresses = createAction(
  '[Users] Load Addresses',
  props<{ addresses: IAddress[] }>()
);

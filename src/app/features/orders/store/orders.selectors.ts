import { createSelector } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import { IOrderState } from './orders.state';

export const selectOrdersState = (state: IAppState) => state.ordersState;

export const selectOrders = createSelector(
  selectOrdersState,
  (state: IOrderState) => state.orders
);
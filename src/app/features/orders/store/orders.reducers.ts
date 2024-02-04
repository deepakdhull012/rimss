import { createReducer, on } from '@ngrx/store';
import { IOrderState } from './orders.state';
import * as OrdersActions from './orders.actions';

export const ordersFeatureKey = 'ordersState';
export const intialOrderState: IOrderState = {
  orders: [],
};

export const orderReducer = createReducer(
  intialOrderState,
  on(OrdersActions.loadOrders, (state, payload) => ({
    ...state,
    orders: payload.orders,
  }))
);

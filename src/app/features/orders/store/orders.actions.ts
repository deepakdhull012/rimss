import { createAction, props } from '@ngrx/store';

import { IOrder } from 'src/app/shared/interfaces/client/order.interface';

export const fetchOrders = createAction(
  '[Orders] Fetch Orders'
);

export const createOrder = createAction(
  '[Orders] Create Order',
  props<{ order: IOrder}>()
);

export const loadOrders = createAction(
  '[Orders] Load Orders',
  props<{ orders: IOrder[] }>()
);
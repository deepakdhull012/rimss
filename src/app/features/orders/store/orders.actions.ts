import { createAction, props } from '@ngrx/store';

import { IOrder } from 'src/app/shared/interfaces/client/order.interface';

export const fetchOrders = createAction(
  '[Orders] Fetch Orders',
  props<{ userId: number}>()
);

export const createOrder = createAction(
  '[Orders] Create Order',
  props<{ order: IOrder}>()
);

export const loadOrders = createAction(
  '[Orders] Load Orders',
  props<{ orders: IOrder[] }>()
);

export const deleteOrder = createAction(
  '[Orders] Delete Order',
  props<{ orderId: number }>()
);
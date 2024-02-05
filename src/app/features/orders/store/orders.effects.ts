import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { ProductsService } from '../../../api/products.service';
import * as OrdersActions from './orders.actions';
import { SalesService } from 'src/app/api/sales.service';
import { OrderService } from 'src/app/api/order.service';

@Injectable()
export class OrdersEffect {
  orderEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.fetchOrders, OrdersActions.createOrder),
      mergeMap((action) => {
        console.error('Order Effect for ', action.type);
        switch (action.type) {
          case OrdersActions.fetchOrders.type:
            return this.orderService.fetchOrder().pipe(
              map((orders) => {
                return {
                  type: OrdersActions.loadOrders.type,
                  orders,
                };
              }),
              catchError(() => EMPTY)
            );
          case OrdersActions.createOrder.type:
            return this.orderService.makeOrder(action.order).pipe(
              map((_) => {
                return {
                  type: OrdersActions.fetchOrders.type,
                };
              }),
              catchError(() => EMPTY)
            );

          default:
            return of(null).pipe(
              map((_) => ({
                type: OrdersActions.loadOrders.type,
                orders: [],
              })),
              catchError(() => EMPTY)
            );
        }
      })
    )
  );

  constructor(private actions$: Actions, private orderService: OrderService) {}
}

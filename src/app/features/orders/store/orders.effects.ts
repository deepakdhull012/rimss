import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import * as OrdersActions from './orders.actions';
import { OrderService } from 'src/app/api/order.service';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class OrdersEffect {
  orderEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.fetchOrders, OrdersActions.createOrder),
      mergeMap((action) => {
        this.logger.log(`Order effect: received action: ${action.type}`);
        switch (action.type) {
          case OrdersActions.fetchOrders.type:
            return this.orderService.fetchOrder().pipe(
              map((orders) => {
                this.logger.log(
                  `Order effect: Success for action: ${action.type} with response ${orders}`
                );
                return {
                  type: OrdersActions.loadOrders.type,
                  orders,
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Order effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );
          case OrdersActions.createOrder.type:
            return this.orderService.makeOrder(action.order).pipe(
              map(() => {
                this.logger.log(
                  `Order effect: Success for action: ${action.type}`
                );
                return {
                  type: OrdersActions.fetchOrders.type,
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Order effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );

          default:
            return of(null).pipe(
              map(() => ({
                type: OrdersActions.loadOrders.type,
                orders: [],
              })),
              catchError(() => EMPTY)
            );
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private orderService: OrderService,
    private logger: NGXLogger
  ) {}
}

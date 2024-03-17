import { Component, OnInit } from '@angular/core';
import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import {
  IOrder,
  IOrderProductUI,
} from 'src/app/shared/interfaces/client/order.interface';
import { IAppState } from 'src/app/core/store/app.state';
import { ActionsSubject, Store } from '@ngrx/store';
import { selectOrders } from '../../store/orders.selectors';
import * as OrdersActions from './../../store/orders.actions';

@Component({
  selector: 'rimss-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent extends BaseComponent implements OnInit {
  private orders: IOrder[] = [];
  public orderProducts: IOrderProductUI[] = [];

  constructor(
    private store: Store<IAppState>,
    private actionsSubject$: ActionsSubject
  ) {
    super();
  }

  public ngOnInit(): void {
    this.actionsSubject$
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter((action) => action.type === OrdersActions.deleteOrder.type)
      )
      .subscribe(() => {
        this.selectOrders();
      });
      this.selectOrders();
      this.fetchOrders();
  }

  /**
   * Cancel the order
   * @param order : IOrderProductUI
   */
  public cancelOrder(order: IOrderProductUI): void {
    if (
      confirm(
        'Are you sure, you want to cancel the order? All products in same order will be cancelled.'
      )
    ) {
      this.store.dispatch(
        OrdersActions.deleteOrder({
          orderId: order.orderId as number,
        })
      );
    }
  }

  /**
   * Fetch user's orders from store
   */
  private fetchOrders(): void {
    this.store.dispatch(OrdersActions.fetchOrders());
  }

  /**
   * Update orders from ngrx store
   */
  private selectOrders(): void {
    this.store
        .select(selectOrders)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: (orders) => {
            this.orders = orders;
            this.mapToOrderProductsUI();
          },
        });
  }

  /**
   * Adapter function to map order to order products
   */
  private mapToOrderProductsUI(): void {
    this.orderProducts = [];
    this.orders.forEach((order) => {
      order.productOrders.forEach((productOrder) => {
        const orderProductUI: IOrderProductUI = {
          deliveryInfo: productOrder.deliveryInfo,
          discountedPrice: productOrder.discountedPrice,
          orderDate: order.orderDate,
          productImage: productOrder.productImage,
          productSummary: productOrder.productSummary,
          orderId: order.id,
          totalOrderAmount: order.orderAmount,
          orderStatus: order.orderStatus,
          productQty: productOrder.qty
        };
        this.orderProducts.push(orderProductUI);
      });
    });
  }
}

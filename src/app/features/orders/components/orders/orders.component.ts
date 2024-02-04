import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import {
  IOrder,
  IOrderProductUI,
} from 'src/app/shared/interfaces/client/order.interface';
import { IAppState } from 'src/app/core/store/app.state';
import { Store } from '@ngrx/store';
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

  constructor(private store: Store<IAppState>) {
    super();
  }

  public ngOnInit(): void {
    this.fetchOrders();
  }

  private fetchOrders(): void {
    this.store.dispatch(OrdersActions.fetchOrders());
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
        };
        this.orderProducts.push(orderProductUI);
      });
    });
  }
}

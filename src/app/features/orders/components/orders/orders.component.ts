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
import { AuthUtilService } from 'src/app/utils/auth-util.service';
import { BannerService } from 'src/app/shared/services/banner.service';
import { BannerType } from 'src/app/shared/interfaces/client/banner.interface';

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
    private authUtilService: AuthUtilService,
    private bannerService: BannerService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.fetchOrders();
  }

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
      this.fetchOrders();
    }
  }

  private fetchOrders(): void {
    const userId = this.authUtilService.getUser()?.id;
    if (userId) {
      this.store.dispatch(
        OrdersActions.fetchOrders({
          userId,
        })
      );
      this.store
        .select(selectOrders)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: (orders) => {
            this.orders = orders;
            this.mapToOrderProductsUI();
          },
        });
    } else {
      this.bannerService.displayBanner.next({
        closeIcon: true,
        closeTime: 2000,
        message: `No logged in user found`,
        type: BannerType.ERROR,
      });
    }
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
          orderId: order.id,
          totalOrderAmount: order.orderAmount,
          orderStatus: order.orderStatus,
        };
        this.orderProducts.push(orderProductUI);
      });
    });
  }
}

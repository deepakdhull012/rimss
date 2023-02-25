import { Component, OnInit } from '@angular/core';
import { of, switchMap, takeLast, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IOrder, IOrderProduct, IOrderProductUI } from 'src/app/shared/interfaces/client/order.interface';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'rimss-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent extends BaseComponent implements OnInit {
  private orders: IOrder[] = [];
  public orderProducts: IOrderProductUI[] = [];

  constructor(private orderService: OrderService) {
    super();
  }

  ngOnInit(): void {
    this.orderService
      .fetchOrder()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((orders) => {
        this.orders = orders;
        this.mapToOrderProductsUI();
      });
  }

  mapToOrderProductsUI(): void {
    this.orderProducts = [];
    this.orders.forEach(order => {
      order.productOrders.forEach(productOrder => {
        const orderProductUI: IOrderProductUI = {
          deliveryInfo: productOrder.deliveryInfo,
          discountedPrice: productOrder.discountedPrice,
          orderDate: order.orderDate,
          productImage: productOrder.productImage,
          productSummary: productOrder.productSummary
        };
        this.orderProducts.push(orderProductUI);
      })
    })
  }


}

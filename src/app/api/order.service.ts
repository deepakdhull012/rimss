import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  IOrder,
  OrderStatus,
} from '../shared/interfaces/client/order.interface';
import { AuthUtilService } from '../utils/auth-util.service';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class OrderService implements OnDestroy {
  private BASE_URL = environment.BASE_API_URL;
  private serviceDestroyed$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private authUtilService: AuthUtilService,
    private logger: NGXLogger
  ) {}

  /**
   * Create the order
   * @returns IOrder[]
   */
  public fetchOrder(): Observable<IOrder[]> {
    const userId = this.authUtilService.getUser()?.id;
    if (userId) {
      return this.http
        .get<IOrder[]>(`${this.BASE_URL}/orders?userId=${userId}`)
        .pipe(takeUntil(this.serviceDestroyed$));
    } else {
      this.logger.error(`No user id found to fetch orders`);
      return of([]);
    }
  }

  /**
   * Make the order
   * @param order : IOrder
   * @returns void
   */
  public makeOrder(order: IOrder): Observable<void> {
    return this.http
      .post<void>(`${this.BASE_URL}/orders`, order)
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  /**
   * Make the order
   * @param order : IOrder
   * @returns void
   */
  public cancel(orderId: number): Observable<void> {
    return this.http
      .patch<void>(`${this.BASE_URL}/orders/${orderId}`, {
        orderStatus: OrderStatus.CANCELLED,
      })
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  /**
   * Make the order
   * @param order : IOrder
   * @returns void
   */
  public deleteOrder(orderId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.BASE_URL}/orders/${orderId}`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }
  /**
   * On destroy life cycle hook
   */
  public ngOnDestroy(): void {
    this.serviceDestroyed$.next();
  }
}

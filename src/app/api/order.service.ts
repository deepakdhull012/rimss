import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IOrder } from '../shared/interfaces/client/order.interface';

@Injectable()
export class OrderService implements OnDestroy {

  private BASE_URL = environment.BASE_API_URL;
  private serviceDestroyed$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  /**
   * Create the order
   * @returns IOrder[]
   */
  public fetchOrder(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.BASE_URL}/orders`).pipe(takeUntil(this.serviceDestroyed$));
    
  }

  /**
   * Make the order
   * @param order : IOrder
   * @returns void
   */
  public makeOrder(order: IOrder): Observable<void> {
    return this.http.post<void>(`${this.BASE_URL}/orders`, order).pipe(takeUntil(this.serviceDestroyed$));
  }
  /**
   * On destroy life cycle hook
   */
  public ngOnDestroy(): void {
      this.serviceDestroyed$.next();
  }
}

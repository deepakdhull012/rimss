import { Injectable } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IBannerSale } from '../features/landing/interfaces/banner-sale.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ICoupon } from '../shared/interfaces/client/order.interface';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private BASE_URL = environment.BASE_API_URL;
  private serviceDestroyed$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  /**
   * Fetch all banner sales from server
   * @returns Observable<Array<IBannerSale>>
   */
  public fetchAllBannerSales(): Observable<Array<IBannerSale>> {
    return this.http
      .get<Array<IBannerSale>>(`${this.BASE_URL}/banner-sales`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  /**
   * Fetch active coupons from server
   * @returns  Observable<ICoupon[]>
   */
  public fetchCoupons(): Observable<ICoupon[]> {
    return this.http
      .get<Array<ICoupon>>(`${this.BASE_URL}/coupons`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }


}

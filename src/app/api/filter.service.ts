import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  IBrand
} from '../features/filter/interfaces/filter-config.interface';

@Injectable()
export class FilterService implements OnDestroy {
  private BASE_URL = environment.BASE_API_URL;

  private serviceDestroyed$ = new Subject<void>();
  public onClear: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient) {}

  /**
   * Fetch all brands from server
   * @returns Observable<Array<IBrand>>
   */
  public getBrands(): Observable<Array<IBrand>> {
    return this.http
      .get<Array<IBrand>>(`${this.BASE_URL}/brands`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  /**
   * Provides price breakpoint for price filter
   * @returns Observable<Array<number>>
   */
  public getPriceBreakPoint(): Observable<Array<number>> {
    return of([500, 1000, 1500, 2000, 5000]);
  }

  /**
   * Provides discount breakpoint for price filter
   * @returns Observable<Array<number>>
   */
  public getDiscountBreakPoints(): Observable<Array<number>> {
    return of([10, 20, 30, 40, 50]);
  }

  /**
   * Provides sizes for filter
   * @returns Observable<Array<string>>
   */
  public getSizes(): Observable<Array<string>> {
    return of(['SM', 'M', 'L', 'XL', 'XXL']);
  }

  /**
   * Hook to clean up resources
   */
  public ngOnDestroy(): void {
    this.serviceDestroyed$.next();
  }
}

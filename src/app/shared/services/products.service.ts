import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { IFilterCriteria, IProductInfo, IProductServer } from '../interfaces/client/product.interface';
import { ICategory } from '../interfaces/client/category.interface';
import { IBannerSale } from 'src/app/features/landing/interfaces/banner-sale.interface';
import { SortBy } from 'src/app/features/product/interfaces/product-info.interface';
import { ICoupon } from '../interfaces/client/order.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService implements OnDestroy {
  private BASE_URL = environment.BASE_API_URL;

  private serviceDestroyed$ = new Subject<void>();

  public productSelected: IProductInfo = {} as IProductInfo;

  constructor(private http: HttpClient) {}

  fetchAllProducts(): Observable<Array<IProductInfo>> {
    return this.http
      .get<Array<IProductInfo>>(`${this.BASE_URL}/products`)
      .pipe(takeUntil(this.serviceDestroyed$),
      map((productsFromServer: Array<IProductServer>) => this.mapServerToClient(productsFromServer)));
  }

  filterProductsByCriteria(filterCriteria: IFilterCriteria, sortBy?: SortBy):  Observable<Array<IProductInfo>> {
    return this.http
      .get<Array<IProductInfo>>(`${this.BASE_URL}/products?${this.getFilterSortString(filterCriteria, sortBy)}`)
      .pipe(takeUntil(this.serviceDestroyed$));

  }

  fetchProductById(pId: number): Observable<IProductInfo> {
    return this.http
      .get<IProductInfo>(`${this.BASE_URL}/products/${pId}`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  fetchAllCategories(): Observable<Array<ICategory>> {
    return this.http
      .get<Array<ICategory>>(`${this.BASE_URL}/categories`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  fetchAllBannerSales(): Observable<Array<IBannerSale>> {
    return this.http
      .get<Array<IBannerSale>>(`${this.BASE_URL}/banner-sales`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  getProductsBySearch(searchText: string): Observable<Array<IProductInfo>> {
    return this.http
      .get<Array<IProductInfo>>(`${this.BASE_URL}/products?q=${searchText}`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  fetchCoupons(): Observable<ICoupon[]> {
    return this.http
      .get<Array<ICoupon>>(`${this.BASE_URL}/coupons`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  private mapServerToClient(products: Array<IProductServer>): Array<IProductInfo> {
    return products as Array<IProductInfo>;
  }

  private getFilterSortString(filterCriteria: IFilterCriteria, sortBy?: SortBy): string {
    let filterString = "";
    if (filterCriteria.filterString) {
      filterString = this.appendNext(filterString);
      filterString += filterCriteria.filterString;
    }
    if (filterCriteria.saleId) {
      filterString = this.appendNext(filterString);
      filterString+= `saleId=${filterCriteria.saleId}`;
    }
    if (filterCriteria.category) {
      filterString = this.appendNext(filterString);
      for (const cat of filterCriteria.category) {
        filterString+= `&productCategory_like=${cat}`
      }
    }
    if (sortBy) {
      filterString = this.appendSort(filterString, sortBy);
    }
    return filterString;
  }

  private appendSort(filterString: string, sortBy: SortBy): string {
    filterString = this.appendNext(filterString);
    switch(sortBy) {
      
      case SortBy.PRICE_LOW_TO_HIGH: 
        filterString+= "_sort=priceAfterDiscount&_order=asc";
        break;
      case SortBy.PRICE_HIGH_TO_LOW:
        filterString+= "_sort=priceAfterDiscount&_order=desc";
        break;
      case SortBy.HIGH_RATED:
        filterString+= "_sort=rating&_order=desc";
        break;
    }
    return filterString;
  }

  private appendNext(filterString: string): string {
    if (filterString.length) {
      filterString+= "&"; 
    }
    return filterString;
  }

  

  ngOnDestroy(): void {
    this.serviceDestroyed$.next();
  }
}

import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { IFilterCriteria, IProductInfo, IProductServer } from '../interfaces/client/product.interface';
import { ICategory } from '../interfaces/client/category.interface';
import { IBannerSale } from 'src/app/features/landing/interfaces/banner-sale.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService implements OnDestroy {
  private BASE_URL = 'http://localhost:3000';

  private serviceDestroyed$ = new Subject<void>();

  public productSelected: IProductInfo = {} as IProductInfo;

  constructor(private http: HttpClient) {}

  fetchAllProducts(): Observable<Array<IProductInfo>> {
    return this.http
      .get<Array<IProductInfo>>(`${this.BASE_URL}/products`)
      .pipe(takeUntil(this.serviceDestroyed$),
      map((productsFromServer: Array<IProductServer>) => this.mapServerToClient(productsFromServer)));
  }

  filterProductsByCriteria(filterCriteria: IFilterCriteria):  Observable<Array<IProductInfo>> {
    return this.http
      .get<Array<IProductInfo>>(`${this.BASE_URL}/products?${filterCriteria.filterString}`)
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

  fetchCategoryProducts(category: Array<string>): Observable<Array<IProductInfo>> {
    return this.http
      .post<Array<IProductInfo>>(`${this.BASE_URL}/products/searchBycategory`, {
        category
      })
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  fetchAllBannerSales(): Observable<Array<IBannerSale>> {
    return this.http
      .get<Array<IBannerSale>>(`${this.BASE_URL}/banner-sales`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  getSaleProducts(saleId: number): Observable<Array<IProductInfo>> {
    return this.http
      .get<Array<IProductInfo>>(`${this.BASE_URL}/products?saleId=${saleId}`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  getProductsBySearch(searchText: string): Observable<Array<IProductInfo>> {
    return this.http
      .get<Array<IProductInfo>>(`${this.BASE_URL}/products?q=${searchText}`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  private mapServerToClient(products: Array<IProductServer>): Array<IProductInfo> {
    return products as Array<IProductInfo>;
  }

  ngOnDestroy(): void {
    this.serviceDestroyed$.next();
  }
}

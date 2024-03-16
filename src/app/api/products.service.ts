import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { SortBy } from 'src/app/features/product/interfaces/product-info.interface';
import { environment } from 'src/environments/environment';
import { IFilterCriteria, IProductInfo, IProductServer } from '../shared/interfaces/client/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService implements OnDestroy {
  private BASE_URL = environment.BASE_API_URL;

  private serviceDestroyed$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  /**
   * Fetch top products from server
   * @returns Observable<Array<IProductInfo>>
   */
  public fetchAllProducts(): Observable<Array<IProductInfo>> {
    return this.http
      .get<Array<IProductInfo>>(`${this.BASE_URL}/products`)
      .pipe(takeUntil(this.serviceDestroyed$),
      map((productsFromServer: Array<IProductServer>) => this.mapServerToClient(productsFromServer)));
  }

  /**
   * Filter products based on criteria
   * @param filterCriteria : IFilterCriteria,
   * @param sortBy : SortBy
   * @returns Observable<Array<IProductInfo>>
   */
  public filterProductsByCriteria(
    filterCriteria: IFilterCriteria,
    sortBy?: SortBy
  ): Observable<Array<IProductInfo>> {
    return this.http
      .get<Array<IProductInfo>>(
        `${this.BASE_URL}/products?${this.getFilterSortString(
          filterCriteria,
          sortBy
        )}`
      )
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  /**
   * Fetch information about specific product
   * @param pId : number
   * @returns Observable<IProductInfo>
   */
  public fetchProductById(pId: number): Observable<IProductInfo> {
    return this.http
      .get<IProductInfo>(`${this.BASE_URL}/products/${pId}`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  /**
   * Fetch products based on search text
   * @param searchText : string
   * @returns Observable<Array<IProductInfo>>
   */
  public fetchProductsBySearchCriteria(searchText: string): Observable<Array<IProductInfo>> {
    return this.http
      .get<Array<IProductInfo>>(`${this.BASE_URL}/products?q=${searchText}`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  /**
   * Adapter to map products
   * @param products : Array<IProductServer>
   * @returns Array<IProductInfo>
   */
  private mapServerToClient(products: Array<IProductServer>): Array<IProductInfo> {
    return products as Array<IProductInfo>;
  }

  /**
   * generate filter string to pass to server
   * @param filterCriteria : IFilterCriteria
   * @param sortBy : SortBy
   * @returns string
   */
  private getFilterSortString(
    filterCriteria: IFilterCriteria,
    sortBy?: SortBy
  ): string {
    let filterString = '';
    if (filterCriteria.filterString) {
      filterString = this.appendNext(filterString);
      filterString += filterCriteria.filterString;
    }
    if (filterCriteria.saleId) {
      filterString = this.appendNext(filterString);
      filterString += `saleId=${filterCriteria.saleId}`;
    }
    if (filterCriteria.category) {
      filterString = this.appendNext(filterString);
      for (const cat of filterCriteria.category) {
        filterString += `&productCategory_like=${cat}`;
      }
    }
    if (sortBy) {
      filterString = this.appendSort(filterString, sortBy);
    }
    return filterString;
  }

  /**
   * appends sort by information to url
   * @param filterString : string
   * @param sortBy : SortBy
   * @returns string
   */
  private appendSort(filterString: string, sortBy: SortBy): string {
    filterString = this.appendNext(filterString);
    switch (sortBy) {
      case SortBy.PRICE_LOW_TO_HIGH:
        filterString += '_sort=priceAfterDiscount&_order=asc';
        break;
      case SortBy.PRICE_HIGH_TO_LOW:
        filterString += '_sort=priceAfterDiscount&_order=desc';
        break;
      case SortBy.HIGH_RATED:
        filterString += '_sort=rating&_order=desc';
        break;
    }
    return filterString;
  }

  /**
   * append & to url for multiple query params
   * @param filterString : string
   * @returns string
   */
  private appendNext(filterString: string): string {
    if (filterString.length) {
      filterString += '&';
    }
    return filterString;
  }

  /**
   * Hook to clean up resources
   */
  public ngOnDestroy(): void {
    this.serviceDestroyed$.next();
  }
}

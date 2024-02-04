import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  IBrand,
  IFilterObject,
  IPriceRange,
} from '../interfaces/filter-config.interface';

@Injectable()
export class FilterService implements OnDestroy {
  private BASE_URL = environment.BASE_API_URL;

  private serviceDestroyed$ = new Subject<void>();
  public onClear: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient) {}

  public getBrands(): Observable<Array<IBrand>> {
    return this.http
      .get<Array<IBrand>>(`${this.BASE_URL}/brands`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  public getPriceBreakPoint(): Observable<Array<number>> {
    return of([500, 1000, 1500, 2000, 5000]);
  }

  public getDiscountBreakPoints(): Observable<Array<number>> {
    return of([10, 20, 30, 40, 50]);
  }

  public getSizes(): Observable<Array<string>> {
    return of(['SM', 'M', 'L', 'XL', 'XXL']);
  }

  public getFilterString(filterObj: IFilterObject): string {
    let filterString = '';
    filterString = this.appendBrandString(filterString, filterObj.brandIds);
    filterString = this.appendPriceString(filterString, filterObj.priceRange);
    filterString = this.appendRatingString(filterString, filterObj.rating);
    filterString = this.appendSizeString(filterString, filterObj.size);
    filterString = this.appendDiscountString(filterString, filterObj.discount);
    return filterString;
  }

  private appendBrandString(
    initialFilterString: string,
    brandIds: Array<number>
  ): string {
    for (const brandId of brandIds) {
      initialFilterString += `brandId=${brandId}&`;
    }
    initialFilterString = initialFilterString.substring(
      0,
      initialFilterString.length - 1
    );
    return initialFilterString;
  }

  private appendPriceString(
    initialFilterString: string,
    priceRanges: Array<IPriceRange>
  ): string {
    for (const priceRange of priceRanges) {
      initialFilterString += `&priceAfterDiscount_gte=${priceRange.min}&priceAfterDiscount_lte=${priceRange.max}`;
    }
    return initialFilterString;
  }

  private appendRatingString(
    initialFilterString: string,
    ratings: Array<number>
  ): string {
    for (const rating of ratings) {
      initialFilterString += `&rating_gte=${rating}&rating_lte=${rating + 1}`;
    }
    return initialFilterString;
  }

  private appendSizeString(
    initialFilterString: string,
    sizes: Array<string>
  ): string {
    for (const size of sizes) {
      initialFilterString += `&sizes_like=${size}`;
    }
    return initialFilterString;
  }

  private appendDiscountString(
    initialFilterString: string,
    discounts: Array<number>
  ): string {
    for (const discount of discounts) {
      initialFilterString += `&productDiscountInPercentage_gte=${discount}`;
    }
    return initialFilterString;
  }

  public ngOnDestroy(): void {
    this.serviceDestroyed$.next();
  }
}

import { Injectable } from '@angular/core';
import { IFilterObject, IPriceRange } from '../features/filter/interfaces/filter-config.interface';

@Injectable({
  providedIn: 'root'
})
export class FilterUtilService {

  constructor() { }

  public getFilterString(filterObj: IFilterObject): string {
    let filterString = '';
    filterString = this.appendBrandString(filterString, filterObj.selectedBrands);
    filterString = this.appendPriceString(filterString, filterObj.selectedPriceRanges);
    filterString = this.appendRatingString(filterString, filterObj.selectedRating);
    filterString = this.appendSizeString(filterString, filterObj.selectedSizes);
    filterString = this.appendDiscountString(filterString, filterObj.selectedDiscountRanges);
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
}

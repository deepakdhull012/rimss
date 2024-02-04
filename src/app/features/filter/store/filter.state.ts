import { IBrand, IPriceRange } from '../interfaces/filter-config.interface';

export interface IFilterState {
  brands: IBrand[];
  priceBreakPoints: number[];
  discountBreakPoints: number[];
  sizes: string[];
  filterState: {
    selectedBrands: number[];
    selectedPriceRanges: IPriceRange[];
    selectedDiscountRanges: number[];
    selectedSizes: string[];
    selectedRating: number[];
  };
}

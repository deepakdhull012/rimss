import { createAction, props } from '@ngrx/store';

import { IBrand, IPriceRange } from '../interfaces/filter-config.interface';

export const fetchBrands = createAction('[Filters] Fetch Brands');

export const fetchPriceBreakPoints = createAction(
  '[Filters] Fetch Price Breakpoints'
);

export const fetchDiscountBreakpoints = createAction(
  '[Filters] Fetch Discount Breakpoints'
);

export const fetchSizes = createAction('[Filters] Fetch Sizes');

export const loadBrands = createAction(
  '[Filters] Load Brands',
  props<{ brands: IBrand[] }>()
);

export const loadPriceBreakpoints = createAction(
  '[Filters] Load Price Breakpoints',
  props<{ priceBreakPoints: number[] }>()
);

export const loadDiscountBreakpoints = createAction(
  '[Filters] Load Discount Breakpoints',
  props<{ discountBreakPoints: number[] }>()
);

export const loadSizes = createAction(
  '[Filters] Load sizes',
  props<{ sizes: string[] }>()
);

export const clearAllFilters = createAction(
  '[Filters] Clear All Filters'
);

export const brandChanged = createAction(
  '[Filters] Brand Changed',
  props<{ selectedBrands: number[] }>()
);

export const priceRangeChanged = createAction(
  '[Filters] Price Range Changed',
  props<{ priceRange: IPriceRange[] }>()
);

export const discountRangeChanged = createAction(
  '[Filters] Discount Range Changed',
  props<{ discountRange: number[] }>()
);

export const sizeChanged = createAction(
  '[Filters] Size Changed',
  props<{ sizes: string[] }>()
);

export const ratingChanged = createAction(
  '[Filters] rating Changed',
  props<{ ratings: number[] }>()
);
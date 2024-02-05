import { createSelector } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import { IFilterState } from './filter.state';

export const selectFilterState = (state: IAppState) => state.filterState;

export const selectBrands = createSelector(
  selectFilterState,
  (state: IFilterState) => state.brands
);

export const selectPriceBreakPoints = createSelector(
  selectFilterState,
  (state: IFilterState) => state.priceBreakPoints
);

export const selectDiscountBreakPoints = createSelector(
  selectFilterState,
  (state: IFilterState) => state.discountBreakPoints
);

export const selectSizes = createSelector(
  selectFilterState,
  (state: IFilterState) => state.sizes
);

export const getFilterState = createSelector(
  selectFilterState,
  (state: IFilterState) => state.filterState
);

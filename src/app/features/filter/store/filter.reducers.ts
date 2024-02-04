import { createReducer, on } from '@ngrx/store';
import { IFilterState } from './filter.state';
import * as FiltersActions from './filter.actions';

export const filtersFeatureKey = 'filterState';
export const intialFilterState: IFilterState = {
  brands: [],
  discountBreakPoints: [],
  priceBreakPoints: [],
  sizes: [],
  filterState: {
    selectedBrands: [],
    selectedDiscountRanges: [],
    selectedPriceRanges: [],
    selectedSizes: [],
    selectedRating: []
  },
};

export const filterReducer = createReducer(
  intialFilterState,
  on(FiltersActions.loadBrands, (state, payload) => ({
    ...state,
    brands: payload.brands,
  })),
  on(FiltersActions.loadPriceBreakpoints, (state, payload) => ({
    ...state,
    priceBreakPoints: payload.priceBreakPoints,
  })),
  on(FiltersActions.loadDiscountBreakpoints, (state, payload) => ({
    ...state,
    discountBreakPoints: payload.discountBreakPoints,
  })),
  on(FiltersActions.loadSizes, (state, payload) => ({
    ...state,
    sizes: payload.sizes,
  })),
  on(FiltersActions.clearAllFilters, (state, payload) => ({
    ...state,
    selectedBrands: [],
    selectedDiscountRanges: [],
    selectedPriceRanges: [],
    selectedSizes: [],
  })),

  on(FiltersActions.brandChanged, (state, payload) => ({
    ...state,
    filterState: {
      ...state.filterState,
      selectedBrands: payload.selectedBrands,
    },
  })),

  on(FiltersActions.priceRangeChanged, (state, payload) => ({
    ...state,
    filterState: {
      ...state.filterState,
      selectedPriceRanges: payload.priceRange,
    },
  })),

  on(FiltersActions.discountRangeChanged, (state, payload) => ({
    ...state,
    filterState: {
      ...state.filterState,
      selectedDiscountRanges: payload.discountRange,
    },
  })),

  on(FiltersActions.sizeChanged, (state, payload) => ({
    ...state,
    filterState: {
      ...state.filterState,
      selectedSizes: payload.sizes,
    },
  })),

  on(FiltersActions.ratingChanged, (state, payload) => ({
    ...state,
    filterState: {
      ...state.filterState,
      selectedRating: payload.ratings,
    },
  }))
);

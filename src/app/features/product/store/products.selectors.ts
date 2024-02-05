import { createSelector } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import { IProductState } from './products.state';

export const selectProductState = (state: IAppState) => state.productsState;

export const selectProducts = createSelector(
  selectProductState,
  (state: IProductState) => state.products
);

export const getSelectedProduct = createSelector(
  selectProductState,
  (state: IProductState) => state.selectedProduct
);

export const getSimilarProducts = createSelector(
  selectProductState,
  (state: IProductState) => state.similarProducts
);

export const getRecommendedProducts = createSelector(
  selectProductState,
  (state: IProductState) => state.recommendedProducts
);

export const selectBannerSales = createSelector(
  selectProductState,
  (state: IProductState) => state.bannerSales
);

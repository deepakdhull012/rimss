import { createReducer, on } from '@ngrx/store';
import { IProductState } from './products.state';
import * as ProductsActions from './products.actions';

export const productsFeatureKey = 'productsState';
export const initialProductState: IProductState = {
  isLoading: false,
  products: [],
  bannerSales: [],
};

export const productReducer = createReducer(
  initialProductState,
  on(ProductsActions.requestLoadProducts, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(ProductsActions.loadProducts, (state, payload) => {
    return { ...state, isLoading: false, products: payload.products };
  }),
  on(ProductsActions.selectProduct, (state, payload) => ({
    ...state,
    selectedProduct: payload.selectedproduct,
  })),
  on(ProductsActions.loadSimilarProducts, (state, payload) => ({
    ...state,
    similarProducts: payload.similarProducts,
  })),
  on(ProductsActions.loadRecommendedProducts, (state, payload) => ({
    ...state,
    recommendedProducts: payload.recommendedProducts,
  })),
  on(ProductsActions.loadBannerSales, (state, payload) => ({
    ...state,
    bannerSales: payload.bannerSales,
  }))
);

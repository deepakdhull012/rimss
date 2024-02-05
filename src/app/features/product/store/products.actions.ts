import { createAction, props } from '@ngrx/store';

import { IFilterCriteria, IProductInfo } from './../../../shared/interfaces/client/product.interface';
import { SortBy } from '../interfaces/product-info.interface';
import { IBannerSale } from '../../landing/interfaces/banner-sale.interface';

export const requestLoadProducts = createAction(
  '[Product/API] Request Load Products'
);

export const fetchProductsByCatgory = createAction(
  '[Product/API] Fetch Products By Category',
  props<{ filterCriteria: IFilterCriteria, sortBy?: SortBy}>()
);

export const fetchSimilarProducts = createAction(
  '[Product/API] Fetch Similar Products',
  props<{ filterCriteria: IFilterCriteria, sortBy?: SortBy}>()
);

export const fetchRecommendedProducts = createAction(
  '[Product/API] Fetch Recommended Products',
  props<{ filterCriteria: IFilterCriteria, sortBy?: SortBy}>()
);

export const fetchProductsBySearchCritera = createAction(
  '[Product/API] Fetch Products By Search Criteria',
  props<{ searchtext: string}>()
);

export const fetchProducts = createAction(
  '[Product/API] Fetch All Products'
);

export const fetchProductById = createAction(
  '[Product/API] Fetch Product By Id',
  props<{ productId: number}>()
);

export const fetchBannerSales = createAction(
  '[Product/API] Fetch Banner Sale'
);

export const selectProduct = createAction(
  'Select Product',
  props<{ selectedproduct: IProductInfo}>()
);

export const loadProducts = createAction(
  '[Product/API] Load Products Success',
  props<{ products: IProductInfo[] }>()
);

export const loadSimilarProducts = createAction(
  '[Product/API] Load Similar Products',
  props<{ similarProducts: IProductInfo[] }>()
);

export const loadRecommendedProducts = createAction(
  '[Product/API] Load Recommended Products',
  props<{ recommendedProducts: IProductInfo[] }>()
);

export const loadBannerSales = createAction(
  '[Product/API] Load Banner Sales',
  props<{ bannerSales: IBannerSale[] }>()
);

export const searchProduct = createAction(
  '[Product/API] Search Products',
  props<{ searchQuery: string }>()
);
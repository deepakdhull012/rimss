import { createAction, props } from '@ngrx/store';

import { IFilterCriteria, IProductInfo } from './../../../shared/interfaces/client/product.interface';
import { SortBy } from '../interfaces/product-info.interface';

export const requestLoadProducts = createAction(
  '[Product/API] Request Load Products'
);

export const fetchCategoryProducts = createAction(
  '[Product/API] Fetch Catgeory Wise Products',
  props<{ filterCriteria: IFilterCriteria, sortBy?: SortBy}>()
);

export const loadProductsSuccess = createAction(
  '[Product/API] Load Products Success',
  props<{ products: IProductInfo[] }>()
);

export const searchProduct = createAction(
  '[Product/API] Search Products',
  props<{ searchQuery: string }>()
);
import { createAction, props } from '@ngrx/store';

import { IProductInfo } from './../../../shared/interfaces/client/product.interface';

export const requestLoadProducts = createAction(
  '[Product/API] Request Load Products'
);

export const loadProductsSuccess = createAction(
  '[Product/API] Load Products Success',
  props<{ products: IProductInfo[] }>()
);

export const searchProduct = createAction(
  '[Product/API] Search Products',
  props<{ searchQuery: string }>()
);
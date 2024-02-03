import { createReducer, on } from "@ngrx/store";
import { IProductState } from "./products.state";
import * as ProductsActions from './products.actions';


export const productsFeatureKey = 'products';
export const initialState: IProductState = {
    isLoading: false,
    products: [
    ]
  };

  export const productReducer = createReducer(
    initialState,
    on(ProductsActions.requestLoadProducts, state => ({ ...state, isLoading: true })),
    on(ProductsActions.loadProductsSuccess, (state, newState) => {
      console.log('again in reducer', state, newState)
      return ({ ...state, isLoading: false, products: newState.products })
    }),

  );
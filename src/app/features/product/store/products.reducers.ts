import { createReducer, on } from "@ngrx/store";
import { IProductState } from "./products.state";
import * as ProductsActions from './products.actions';


export const productsFeatureKey = 'products';
export const initialState: IProductState = {
    isLoading: false,
    products: [
        {
            currency: "INR",
            id: 1,
            mainImage: "",
            price: 100,
            priceAfterDiscount: 90,
            productBrief: "Brief",
            productName: "Name",
            rating: 3
        }
    ]
  };

  export const productReducer = createReducer(
    initialState,
    on(ProductsActions.requestLoadProducts, state => ({ ...state, isLoading: true })),
    on(ProductsActions.loadProductsSuccess, state => ({ ...state, isLoading: false, products: state.products })),

  );
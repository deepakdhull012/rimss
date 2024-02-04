import { createReducer, on } from "@ngrx/store";
import { ICartWishListState } from "./cart-wishlist.state";
import * as CartWishlistActions from './cart-wishlist.actions';


export const cartWishlistFeatureKey = 'cartWishlistState';
export const intialCartWishlistState: ICartWishListState = {
    cartProducts: [],
    wishListProducts: [],
    coupons: []
  };

  export const cartWishlistReducer = createReducer(
    intialCartWishlistState,
    on(CartWishlistActions.loadCartProducts, (state,payload) => ({ ...state, cartProducts: payload.cartProducts })),
    on(CartWishlistActions.loadWishListProducts, (state,payload) =>{ return ({ ...state, wishListProducts: payload.wishlistProducts }) }),
    on(CartWishlistActions.loadCoupons, (state,payload) =>{ return ({ ...state, coupons: payload.coupons }) }),

  );
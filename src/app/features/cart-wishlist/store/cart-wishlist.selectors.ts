import { createSelector } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import { ICartWishListState } from './cart-wishlist.state';

export const selectCartWishlistState = (state: IAppState) => {
  return state.cartWishlistState;
}

export const selectCartProducts = createSelector(
  selectCartWishlistState,
  (state: ICartWishListState) => {
    return state.cartProducts;
  }
);

export const selectWishlistProducts = createSelector(
  selectCartWishlistState,
  (state: ICartWishListState) => state.wishListProducts
);

export const selectCoupons = createSelector(
  selectCartWishlistState,
  (state: ICartWishListState) => state.coupons
);


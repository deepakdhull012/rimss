import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import * as CartWishListActions from './cart-wishlist.actions';
import { CartWishlistService } from '../../../api/cart-wishlist.service';
import { SalesService } from 'src/app/api/sales.service';

@Injectable()
export class CartWishlistEffects {
  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CartWishListActions.fetchCartProducts,
        CartWishListActions.fetchWishlistProducts,
        CartWishListActions.removeFromCart,
        CartWishListActions.removeFromWishlist,
        CartWishListActions.clearCartItems,
        CartWishListActions.addProductToCart,
        CartWishListActions.addProductToWishlist,
        CartWishListActions.fetchCoupons
      ),
      mergeMap((action) => {
        console.error('Cart Wishlist Effect for ', action.type);
        switch (action.type) {
          case CartWishListActions.fetchCartProducts.type:
            return this.cartWishListService.getCartProducts().pipe(
              map((cartProducts) => {
                return {
                  type: CartWishListActions.loadCartProducts.type,
                  cartProducts: cartProducts,
                };
              }),
              catchError(() => EMPTY)
            );
          case CartWishListActions.fetchWishlistProducts.type:
            return this.cartWishListService.getWishListProducts().pipe(
              map((wishListProducts) => {
                console.log('wishList Products', wishListProducts);
                return {
                  type: CartWishListActions.loadWishListProducts.type,
                  wishlistProducts: wishListProducts,
                };
              }),
              catchError(() => EMPTY)
            );
          case CartWishListActions.removeFromCart.type:
            return this.cartWishListService
              .removeFromCart(action.productId)
              .pipe(
                map((_) => {
                  return {
                    type: CartWishListActions.fetchCartProducts.type,
                  };
                }),
                catchError(() => EMPTY)
              );

          case CartWishListActions.removeFromWishlist.type:
            return this.cartWishListService
              .removeFromWishList(action.productId)
              .pipe(
                map((_) => {
                  return {
                    type: CartWishListActions.fetchWishlistProducts.type,
                  };
                }),
                catchError(() => EMPTY)
              );

          case CartWishListActions.addProductToCart.type:
            return this.cartWishListService
              .addProductToCart(action.cartProduct)
              .pipe(
                map((_) => {
                  return {
                    type: CartWishListActions.fetchCartProducts.type,
                  };
                }),
                catchError(() => EMPTY)
              );
          case CartWishListActions.addProductToWishlist.type:
            return this.cartWishListService
              .addProductToWishList(action.productId, action.email)
              .pipe(
                map((_) => {
                  return {
                    type: CartWishListActions.fetchWishlistProducts.type,
                  };
                }),
                catchError(() => EMPTY)
              );

          case CartWishListActions.clearCartItems.type:
            return this.cartWishListService.clearCart().pipe(
              map((_) => {
                return {
                  type: CartWishListActions.fetchCartProducts.type,
                };
              }),
              catchError(() => {
                return EMPTY;
              })
            );
            case CartWishListActions.fetchCoupons.type:
              return this.salesService.fetchCoupons().pipe(
                map(coupons => {
                  return {
                    type: CartWishListActions.loadCoupons.type,
                    coupons: coupons
                  };
                }),
                catchError(() => {
                  return EMPTY;
                })
              );
          default:
            return of(null).pipe(
              map((_) => ({
                type: CartWishListActions.loadCartProducts.type,
                payload: [],
              })),
              catchError(() => EMPTY)
            );
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private cartWishListService: CartWishlistService,
    private salesService: SalesService
  ) {}
}

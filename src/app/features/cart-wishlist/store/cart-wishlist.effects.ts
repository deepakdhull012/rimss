import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import * as CartWishListActions from './cart-wishlist.actions';
import { CartWishlistService } from '../../../api/cart-wishlist.service';
import { SalesService } from 'src/app/api/sales.service';
import { NGXLogger } from 'ngx-logger';

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
        this.logger.log(`Cart effect: received action: ${action.type}`);
        switch (action.type) {
          case CartWishListActions.fetchCartProducts.type:
            return this.cartWishListService.getCartProducts().pipe(
              map((cartProducts) => {
                this.logger.log(
                  `Cart effect: Success for action: ${action.type} with response ${cartProducts}`
                );
                return {
                  type: CartWishListActions.loadCartProducts.type,
                  cartProducts: cartProducts,
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Cart effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );
          case CartWishListActions.fetchWishlistProducts.type:
            return this.cartWishListService.getWishListProducts().pipe(
              map((wishListProducts) => {
                this.logger.log(
                  `Cart effect: Success for action: ${action.type} with response ${wishListProducts}`
                );
                return {
                  type: CartWishListActions.loadWishListProducts.type,
                  wishlistProducts: wishListProducts,
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Cart effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );
          case CartWishListActions.removeFromCart.type:
            return this.cartWishListService
              .removeFromCart(action.productId)
              .pipe(
                map(() => {
                  this.logger.log(
                    `Cart effect: Success for action: ${action.type}`
                  );
                  return {
                    type: CartWishListActions.fetchCartProducts.type,
                  };
                }),
                catchError(() => {
                  this.logger.error(
                    'Cart effect: Error in action: ' + action.type
                  );
                  return EMPTY;
                })
              );

          case CartWishListActions.removeFromWishlist.type:
            return this.cartWishListService
              .removeFromWishList(action.productId)
              .pipe(
                map(() => {
                  this.logger.log(
                    `Cart effect: Success for action: ${action.type}`
                  );
                  return {
                    type: CartWishListActions.fetchWishlistProducts.type,
                  };
                }),
                catchError(() => {
                  this.logger.error(
                    'Cart effect: Error in action: ' + action.type
                  );
                  return EMPTY;
                })
              );

          case CartWishListActions.addProductToCart.type:
            return this.cartWishListService
              .addProductToCart(action.cartProduct)
              .pipe(
                map(() => {
                  this.logger.log(
                    `Cart effect: Success for action: ${action.type}`
                  );
                  return {
                    type: CartWishListActions.fetchCartProducts.type,
                  };
                }),
                catchError(() => {
                  this.logger.error(
                    'Cart effect: Error in action: ' + action.type
                  );
                  return EMPTY;
                })
              );
          case CartWishListActions.addProductToWishlist.type:
            return this.cartWishListService
              .addProductToWishList(action.productId, action.email)
              .pipe(
                map(() => {
                  this.logger.log(
                    `Cart effect: Success for action: ${action.type}`
                  );
                  return {
                    type: CartWishListActions.fetchWishlistProducts.type,
                  };
                }),
                catchError(() => {
                  this.logger.error(
                    'Cart effect: Error in action: ' + action.type
                  );
                  return EMPTY;
                })
              );

          case CartWishListActions.clearCartItems.type:
            return this.cartWishListService.clearCart().pipe(
              map(() => {
                this.logger.log(
                  `Cart effect: Success for action: ${action.type}`
                );
                return {
                  type: CartWishListActions.fetchCartProducts.type,
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Cart effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );
          case CartWishListActions.fetchCoupons.type:
            return this.salesService.fetchCoupons().pipe(
              map((coupons) => {
                this.logger.log(
                  `Cart effect: Success for action: ${action.type} with response ${coupons}`
                );
                return {
                  type: CartWishListActions.loadCoupons.type,
                  coupons: coupons,
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Cart effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );
          default:
            return of(null).pipe(
              map(() => ({
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
    private salesService: SalesService,
    private logger: NGXLogger
  ) {}
}

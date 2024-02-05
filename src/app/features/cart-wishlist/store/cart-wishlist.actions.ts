import { createAction, props } from '@ngrx/store';
import { ICartProduct } from '../interfaces/cart-product.interface';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { ICoupon } from 'src/app/shared/interfaces/client/order.interface';


export const fetchCartProducts = createAction(
  '[Cart] Fetch Cart Products'
);

export const fetchWishlistProducts = createAction(
  '[Cart] Fetch Wishlist Products'
);

export const fetchCoupons = createAction(
  '[Cart/Order] Fetch Coupons'
);

export const clearCartItems = createAction(
  '[Cart] Clear cart items'
);

export const removeFromCart = createAction(
  '[Cart] Remove product from cart',
  props<{ productId: number }>()
);

export const removeFromWishlist = createAction(
  '[Cart] Remove product from wishlist',
  props<{ productId: number }>()
);

export const addProductToCart = createAction(
  '[Cart] Add product to cart',
  props<{ cartProduct: ICartProduct }>()
);

export const addProductToWishlist = createAction(
  '[Cart] Add product to wishlist',
  props<{ productId: number, email: string }>()
);

export const loadCartProducts = createAction(
  '[Cart] Load Cart Products',
  props<{ cartProducts: ICartProduct[] }>()
);

export const loadWishListProducts = createAction(
  '[Cart] Load Wishlist Products',
  props<{ wishlistProducts: IProductInfo[] }>()
);

export const loadCoupons = createAction(
  '[Cart/Order] Load Coupons',
  props<{ coupons: ICoupon[] }>()
);

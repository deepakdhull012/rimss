import { IWishListProduct } from "src/app/shared/interfaces/client/wish-list.interface";
import { ICartProduct } from "../interfaces/cart-product.interface";
import { ICoupon } from "src/app/shared/interfaces/client/order.interface";
import { IProductInfo } from "src/app/shared/interfaces/client/product.interface";

export interface ICartWishListState {
    cartProducts: ICartProduct[],
    wishListProducts: IProductInfo[],
    coupons: ICoupon[]
}
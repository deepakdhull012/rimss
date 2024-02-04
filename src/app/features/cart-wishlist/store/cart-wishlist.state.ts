import { IProductInfo } from "src/app/shared/interfaces/client/product.interface";
import { ICartProduct } from "../interfaces/cart-product.interface";
import { ICoupon } from "src/app/shared/interfaces/client/order.interface";

export interface ICartWishListState {
    cartProducts: ICartProduct[],
    wishListProducts: IProductInfo[],
    coupons: ICoupon[]
}
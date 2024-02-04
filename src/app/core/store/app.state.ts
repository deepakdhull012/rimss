import { productsFeatureKey } from 'src/app/features/product/store/products.reducers';
import { coreFeatureKey } from './app.reducers';
import { IProductState } from 'src/app/features/product/store/products.state';
import { ICategory } from 'src/app/shared/interfaces/client/category.interface';
import { cartWishlistFeatureKey } from 'src/app/features/cart-wishlist/store/cart-wishlist.reducers';
import { ICartWishListState } from 'src/app/features/cart-wishlist/store/cart-wishlist.state';
import { ordersFeatureKey } from 'src/app/features/orders/store/orders.reducers';
import { IOrderState } from 'src/app/features/orders/store/orders.state';

export interface ICoreState {
  categories: ICategory[];
}
export interface IAppState {
  [coreFeatureKey]: ICoreState;
  [productsFeatureKey]: IProductState;
  [cartWishlistFeatureKey]: ICartWishListState;
  [ordersFeatureKey]: IOrderState;
}

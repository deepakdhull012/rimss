import { productsFeatureKey } from 'src/app/features/product/store/products.reducers';
import { coreFeatureKey } from './app.reducers';
import { IProductState } from 'src/app/features/product/store/products.state';
import { ICategory } from 'src/app/shared/interfaces/client/category.interface';
import { cartWishlistFeatureKey } from 'src/app/features/cart-wishlist/store/cart-wishlist.reducers';
import { ICartWishListState } from 'src/app/features/cart-wishlist/store/cart-wishlist.state';
import { ordersFeatureKey } from 'src/app/features/orders/store/orders.reducers';
import { IOrderState } from 'src/app/features/orders/store/orders.state';
import { filtersFeatureKey } from 'src/app/features/filter/store/filter.reducers';
import { IFilterState } from 'src/app/features/filter/store/filter.state';
import { authFeatureKey } from 'src/app/features/authentication/store/auth.reducers';
import { IAuthState } from 'src/app/features/authentication/store/auth.state';
import { userFeatureKey } from 'src/app/features/user/store/users.reducers';
import { IUserState } from 'src/app/features/user/store/users.state';

export interface ICoreState {
  categories: ICategory[];
}
export interface IAppState {
  [coreFeatureKey]: ICoreState;
  [productsFeatureKey]: IProductState;
  [cartWishlistFeatureKey]: ICartWishListState;
  [ordersFeatureKey]: IOrderState;
  [filtersFeatureKey]: IFilterState;
  [authFeatureKey]: IAuthState;
  [userFeatureKey]: IUserState;
}

import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
  forkJoin,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { IWishListProduct } from 'src/app/shared/interfaces/client/wish-list.interface';
import { environment } from 'src/environments/environment';
import { ICartProduct } from '../features/cart-wishlist/interfaces/cart-product.interface';
import { AuthUtilService } from '../utils/auth-util.service';

@Injectable({
  providedIn: 'root',
})
export class CartWishlistService implements OnDestroy {
  private serviceDestroyed$ = new Subject<void>();

  public cartUpdated: Subject<void> = new Subject<void>();
  public wishListUpdated: Subject<void> = new Subject<void>();

  private BASE_URL = environment.BASE_API_URL;

  constructor(
    private httpClient: HttpClient,
    private authUtilService: AuthUtilService
  ) {}

  /**
   * Adds the product to wishlist and return the server response
   * @param productId : number
   * @param email : string
   * @returns Observable<IWishListProduct>
   */
  public addProductToWishList(
    productId: number,
    email: string
  ): Observable<IWishListProduct> {
    return this.httpClient
      .post<IWishListProduct>(`${this.BASE_URL}/wish-list`, {
        productId,
        email,
      })
      .pipe(
        takeUntil(this.serviceDestroyed$),
        tap(() => {
          this.wishListUpdated.next();
        })
      );
  }

  /**
   * Add product to cart
   * @param cartProduct : ICartProduct
   * @returns Observable<ICartProduct>
   */
  public addProductToCart(cartProduct: ICartProduct): Observable<ICartProduct> {
    return this.httpClient
      .post<ICartProduct>(`${this.BASE_URL}/cart`, cartProduct)
      .pipe(
        takeUntil(this.serviceDestroyed$),
        tap(() => {
          this.cartUpdated.next();
        })
      );
  }

  /**
   * Fetch all wishlist products
   * @returns Observable<IProductInfo[]>
   */
  public getWishListProducts(): Observable<IProductInfo[]> {
    const loggedInUserEmail = this.authUtilService.getLoggedInEmail();
    return this.httpClient
      .get<Array<IWishListProduct>>(
        `${this.BASE_URL}/wish-list?email=${loggedInUserEmail}`
      )
      .pipe(
        takeUntil(this.serviceDestroyed$),
        switchMap((wishlistProducts) => {
          if (wishlistProducts.length) {
            let filterString = '';
            wishlistProducts.forEach((w) => {
              filterString += `id=${w.productId}&`;
            });
            filterString = filterString.substring(0, filterString.length - 1);
            return this.httpClient
              .get<Array<IProductInfo>>(
                `${this.BASE_URL}/products?${filterString}`
              )
              .pipe(
                map((products) =>
                  this.setWishListId(products, wishlistProducts)
                )
              );
          } else {
            return of([]);
          }
        })
      );
  }

  /**
   * Set wish list id to each product - to display wishlist status on UI
   * @param products : IProductInfo[]
   * @param wishlistProducts : IWishListProduct[]
   * @returns IProductInfo[]
   */
  private setWishListId(
    products: IProductInfo[],
    wishlistProducts: IWishListProduct[]
  ): IProductInfo[] {
    products.forEach((product) => {
      product.wishListId = this.getWishListIdForProduct(
        product,
        wishlistProducts
      );
    });
    return products;
  }

  /**
   * Get wish list id for product (used as internal function )
   * @param product : IProductInfo
   * @param wishListProducts : IWishListProduct[]
   * @returns number | null
   */
  private getWishListIdForProduct(
    product: IProductInfo,
    wishListProducts: IWishListProduct[]
  ): number | null {
    const matchingWishlistProduct = wishListProducts.find(
      (wp) => wp.productId === product.id
    );
    return matchingWishlistProduct ? matchingWishlistProduct.id : null;
  }

  /**
   * Fetch cart products of current user
   * @returns Observable<Array<ICartProduct>>
   */
  public getCartProducts(): Observable<Array<ICartProduct>> {
    const loggedInUserEmail = this.authUtilService.getLoggedInEmail();
    return this.httpClient.get<Array<ICartProduct>>(
      `${this.BASE_URL}/cart?userEmail=${loggedInUserEmail}`
    );
  }

  /**
   * Remove a specific product from cart
   * @param cartProductId : number
   * @returns Observable<void>
   */
  public removeFromCart(cartProductId: number): Observable<void> {
    return this.httpClient
      .delete(`${this.BASE_URL}/cart/${cartProductId}`)
      .pipe(map(() => {}));
  }

  /**
   * Remove product from wishlist
   * @param wishListProductId : number
   * @returns Observable<void>
   */
  public removeFromWishList(wishListProductId: number): Observable<void> {
    return this.httpClient
      .delete(`${this.BASE_URL}/wish-list/${wishListProductId}`)
      .pipe(map(() => {}));
  }

  /**
   * Clear cart
   * @returns Observable<void>
   */
  public clearCart(): Observable<void> {
    return this.getCartProducts().pipe(
      switchMap((cartProducts) => {
        const cartremoveRequest$: Array<Observable<void>> = [];
        cartProducts.forEach((cartProduct) => {
          const removeCartReq = this.removeFromCart(cartProduct.id as number);
          cartremoveRequest$.push(removeCartReq);
        });
        return forkJoin(cartremoveRequest$).pipe(map(() => {}));
      })
    );
  }

  /**
   * On destroy emits an subject which can be used to unsubscribe from observables (This hook can be used for resource cleaning purpose)
   */
  public ngOnDestroy(): void {
    this.serviceDestroyed$.next();
  }
}

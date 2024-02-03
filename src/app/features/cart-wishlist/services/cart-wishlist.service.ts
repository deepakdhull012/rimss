import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
  forkJoin,
  Observable, Subject,
  switchMap,
  takeUntil,
  tap
} from 'rxjs';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { IWishList } from 'src/app/shared/interfaces/client/wish-list.interface';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../authentication/services/auth.service';
import { ICartProduct } from '../interfaces/cart-product.interface';

@Injectable({
  providedIn: "root"
})
export class CartWishlistService implements OnDestroy {
  private serviceDestroyed$ = new Subject<void>();

  public cartProducts: Array<ICartProduct> = [];
  public wishListProducts: Array<IWishList> = [];
  public cartUpdated: Subject<void> = new Subject<void>();
  public wishListUpdated: Subject<void> = new Subject<void>();

  private BASE_URL = environment.BASE_API_URL;
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
   
  }

  addProductToWishList(
    productId: number,
    email: string
  ): Observable<IWishList> {
    return this.httpClient
      .post<IWishList>(`${this.BASE_URL}/wish-list`, {
        productId,
        email,
      })
      .pipe(
        takeUntil(this.serviceDestroyed$),
        tap((_) => {
          this.wishListUpdated.next();
        })
      );
  }

  addProductToCart(cartProduct: ICartProduct): Observable<ICartProduct> {
    return this.httpClient
      .post<ICartProduct>(`${this.BASE_URL}/cart`, cartProduct)
      .pipe(
        takeUntil(this.serviceDestroyed$),
        tap((_) => {
          this.cartUpdated.next();
        })
      );
  }

  getWishListProducts(): Observable<IProductInfo[]> {
    const loggedInUserEmail = this.authService.getLoggedInEmail();
    return this.httpClient
      .get<Array<IWishList>>(
        `${this.BASE_URL}/wish-list?email=${loggedInUserEmail}`
      )
      .pipe(
        takeUntil(this.serviceDestroyed$),
        switchMap((wishlistProducts) => {
          this.wishListProducts = wishlistProducts;
          let filterString = '';
          this.wishListProducts.forEach((w) => {
            filterString += `id=${w.productId}&`;
          });
          filterString = filterString.substring(0, filterString.length - 1);
          return this.httpClient.get<Array<IProductInfo>>(
            `${this.BASE_URL}/products?${filterString}`
          );
        })
      );
  }

  getCartProducts(): Observable<Array<ICartProduct>> {
    const loggedInUserEmail = this.authService.getLoggedInEmail();
    return this.httpClient
      .get<Array<ICartProduct>>(
        `${this.BASE_URL}/cart?userEmail=${loggedInUserEmail}`
      )
      .pipe(
        takeUntil(this.serviceDestroyed$),
        tap((cartProducts) => {
          this.cartProducts = cartProducts;
        })
      );
  }

  removeFromCart(cartProductId: number): Observable<any> {
    return this.httpClient
      .delete(`${this.BASE_URL}/cart/${cartProductId}`)
      .pipe(
        takeUntil(this.serviceDestroyed$),
        tap((_) => {
          this.cartUpdated.next();
        })
      );
  }

  removeFromWishList(wishListProductId: number): Observable<any> {
    return this.httpClient
      .delete(`${this.BASE_URL}/wish-list/${wishListProductId}`)
      .pipe(
        takeUntil(this.serviceDestroyed$),
        tap((_) => {
          this.wishListUpdated.next();
        })
      );
  }

  clearCart(): Observable<any> {
    const cartremoveRequest$: any[] = [];
    this.cartProducts.forEach((cartProduct) => {
      const removeCartReq = this.removeFromCart(cartProduct.id as number);
      cartremoveRequest$.push(removeCartReq);
    });
    return forkJoin(cartremoveRequest$);
  }

  ngOnDestroy(): void {
    this.serviceDestroyed$.next();
  }
}

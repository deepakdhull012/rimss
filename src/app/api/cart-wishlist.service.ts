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
import { AuthService } from '../features/authentication/services/auth.service';
import { ICartProduct } from '../features/cart-wishlist/interfaces/cart-product.interface';

@Injectable({
  providedIn: "root"
})
export class CartWishlistService implements OnDestroy {
  private serviceDestroyed$ = new Subject<void>();


  public cartUpdated: Subject<void> = new Subject<void>();
  public wishListUpdated: Subject<void> = new Subject<void>();

  private BASE_URL = environment.BASE_API_URL;
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
   
  }

  public addProductToWishList(
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

  public addProductToCart(cartProduct: ICartProduct): Observable<ICartProduct> {
    return this.httpClient
      .post<ICartProduct>(`${this.BASE_URL}/cart`, cartProduct)
      .pipe(
        takeUntil(this.serviceDestroyed$),
        tap((_) => {
          this.cartUpdated.next();
        })
      );
  }

  public getWishListProducts(): Observable<IProductInfo[]> {
    const loggedInUserEmail = this.authService.getLoggedInEmail();
    return this.httpClient
      .get<Array<IWishList>>(
        `${this.BASE_URL}/wish-list?email=${loggedInUserEmail}`
      )
      .pipe(
        takeUntil(this.serviceDestroyed$),
        switchMap((wishlistProducts) => {
          let filterString = '';
          wishlistProducts.forEach((w) => {
            filterString += `id=${w.productId}&`;
          });
          filterString = filterString.substring(0, filterString.length - 1);
          return this.httpClient.get<Array<IProductInfo>>(
            `${this.BASE_URL}/products?${filterString}`
          );
        })
      );
  }

  public getCartProducts(): Observable<Array<ICartProduct>> {
    const loggedInUserEmail = this.authService.getLoggedInEmail();
    return this.httpClient
      .get<Array<ICartProduct>>(
        `${this.BASE_URL}/cart?userEmail=${loggedInUserEmail}`
      );
  }

  public removeFromCart(cartProductId: number): Observable<any> {
    return this.httpClient
      .delete(`${this.BASE_URL}/cart/${cartProductId}`);
  }

  public removeFromWishList(wishListProductId: number): Observable<any> {
    return this.httpClient
      .delete(`${this.BASE_URL}/wish-list/${wishListProductId}`);
  }

  public clearCart(): Observable<any> {
    
    return this.getCartProducts().pipe(switchMap(cartProducts => {
      const cartremoveRequest$: any[] = [];
      cartProducts.forEach((cartProduct) => {
        const removeCartReq = this.removeFromCart(cartProduct.id as number);
        cartremoveRequest$.push(removeCartReq);
      });
      return forkJoin(cartremoveRequest$);
    }))
  }

  public ngOnDestroy(): void {
    this.serviceDestroyed$.next();
  }
}

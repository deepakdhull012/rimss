import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IWishList } from 'src/app/shared/interfaces/client/wish-list.interface';
import { AuthService } from '../../authentication/services/auth.service';
import { ICartProduct } from '../interfaces/cart-product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartWishlistService implements OnDestroy {
  private serviceDestroyed$ = new Subject<void>();

  public cartProducts: Array<ICartProduct> = [];
  public wishListProducts: Array<IWishList> = [];
  public cartUpdated: Subject<void> = new Subject<void>();
  public wishListUpdated: Subject<void> = new Subject<void>();

  private BASE_URL = 'http://localhost:3000';
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

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

  getWishListProducts(): Observable<Array<IWishList>> {
    const loggedInUserEmail = this.authService.getLoggedInEmail();
    return this.httpClient
      .get<Array<IWishList>>(
        `${this.BASE_URL}/wish-list?email=${loggedInUserEmail}`
      )
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  getCartProducts(): Observable<Array<ICartProduct>> {
    const loggedInUserEmail = this.authService.getLoggedInEmail();
    return this.httpClient
      .get<Array<ICartProduct>>(
        `${this.BASE_URL}/cart?userEmail=${loggedInUserEmail}`
      )
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  removeFromCart(cartProductId: number): Observable<any> {
    return this.httpClient
      .delete(`${this.BASE_URL}/cart/${cartProductId}`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  removeFromWishList(wishListProductId: number): Observable<any> {
    return this.httpClient
      .delete(`${this.BASE_URL}/wish-list/${wishListProductId}`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  ngOnDestroy(): void {
    this.serviceDestroyed$.next();
  }
}

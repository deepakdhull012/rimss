import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { BannerType } from 'src/app/shared/interfaces/client/banner.interface';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { BannerService } from 'src/app/shared/services/banner.service';
import { IProductInfoConfig } from '../../interfaces/product-info.interface';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import * as ProductsActions from './../../store/products.actions';
import {
  selectCartProducts,
  selectWishlistProducts,
} from 'src/app/features/cart-wishlist/store/cart-wishlist.selectors';
import { ICartProduct } from 'src/app/features/cart-wishlist/interfaces/cart-product.interface';
import * as CartWishlistActions from './../../../cart-wishlist/store/cart-wishlist.actions';
import { AuthUtilService } from 'src/app/utils/auth-util.service';

@Component({
  selector: 'rimss-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss'],
})
export class ProductInfoComponent extends BaseComponent implements OnInit {
  @Input() productInfo: IProductInfo = {} as IProductInfo;
  @Input() productInfoConfig?: IProductInfoConfig;

  constructor(
    private authUtilService: AuthUtilService,
    private bannerService: BannerService,
    private router: Router,
    private store: Store<IAppState>
  ) {
    super();
  }

  private cartProducts: ICartProduct[] = [];
  private wishlistProducts: IProductInfo[] = [];

  public ngOnInit(): void {
    this.updateCartStatus();
    this.updateWishListStatus();
    this.store
      .select(selectCartProducts)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((cartProducts) => {
        this.cartProducts = cartProducts;
        this.updateCartStatus();
      });
    this.store
      .select(selectWishlistProducts)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((wishlistProducts) => {
        this.wishlistProducts = wishlistProducts;
        this.updateWishListStatus();
      });
  }

  public addToWishList(): void {
    const loggedInUserEmail = this.authUtilService.getLoggedInEmail();
    console.error(this.wishlistProducts, this.productInfo.id)
    const productInWishList = this.wishlistProducts.find((p) => {
      return p.id === this.productInfo.id;
    });
    if (productInWishList) {
      this.removeFromWishList();
    } else {
      if (loggedInUserEmail) {
        this.store.dispatch(
          CartWishlistActions.addProductToWishlist({
            productId: this.productInfo.id,
            email: loggedInUserEmail,
          })
        );
      } else {
        this.bannerService.displayBanner.next({
          closeIcon: true,
          closeTime: 1000,
          message: 'Please login to perform the action',
          type: BannerType.WARN,
        });
      }
    }
  }

  public goToDetailPage(productInfo: IProductInfo): void {
    this.store.dispatch(
      ProductsActions.selectProduct({ selectedproduct: productInfo })
    );
    this.router.navigate([`products`, `details`, `${productInfo.id}`]);
  }

  public addToCart(): void {
    const loggedInUserEmail = this.authUtilService.getLoggedInEmail();
    if (loggedInUserEmail) {
      this.store.dispatch(
        CartWishlistActions.addProductToCart({
          cartProduct: {
            cartAddDate: new Date(),
            cartProductImage: this.productInfo.mainImage,
            productBrief: this.productInfo.productBrief,
            productId: this.productInfo.id,
            productName: this.productInfo.productName,
            quantity: 1,
            unitCurrency: this.productInfo.currency,
            unitPrice: this.productInfo.price,
            discountedPrice: this.productInfo.priceAfterDiscount,
            userEmail: loggedInUserEmail,
          },
        })
      );
      this.store
        .select(selectCartProducts)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: (cartProducts) => {
            this.bannerService.displayBanner.next({
              closeIcon: true,
              closeTime: 1000,
              message: 'Product added to cart',
              type: BannerType.SUCCESS,
            });
          },
        });
    } else {
      this.bannerService.displayBanner.next({
        closeIcon: true,
        closeTime: 2000,
        message: 'Please login to perform the action',
        type: BannerType.WARN,
      });
    }
  }

  public removeFromCart(): void {
    const cartProductId = this.cartProducts.find(
      (cartP) => {
        return cartP.productId === this.productInfo.id;
      }
    )?.id;
    if (cartProductId) {
      this.store.dispatch(CartWishlistActions.removeFromCart({
        productId: cartProductId
      }));
    }
  }

  private updateCartStatus(): void {
    const productInCart = this.cartProducts.find((p) => {
      return p.productId === this.productInfo.id;
    });
    this.productInfo = { ...this.productInfo, isInCart: !!productInCart };
  }

  private updateWishListStatus(): void {
    const productInWishList = this.wishlistProducts.find(
      (wishListProduct) => {
        return wishListProduct.id === this.productInfo.id;
      }
    );
    this.productInfo = {
      ...this.productInfo,
      isInWishList: !!productInWishList,
    };
  }

  private removeFromWishList(): void {
    const productInWishList = this.wishlistProducts.find(
      (wishListProduct) => {
        return wishListProduct.id === this.productInfo.id;
      }
    );
    if (productInWishList) {
      this.store.dispatch(CartWishlistActions.removeFromWishlist({
        productId: productInWishList.id
      }));
    }
  }
}

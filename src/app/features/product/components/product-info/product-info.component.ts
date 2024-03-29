import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { BannerType } from 'src/app/shared/interfaces/client/banner.interface';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { BannerService } from 'src/app/shared/services/banner.service';
import { IProductInfoConfig } from '../../interfaces/product-info.interface';
import { ActionsSubject, Store } from '@ngrx/store';
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
    private store: Store<IAppState>,
    private actionsSubject$: ActionsSubject
  ) {
    super();
  }

  private cartProducts: ICartProduct[] = [];
  private wishlistProducts: IProductInfo[] = [];

  public ngOnInit(): void {
    this.listenToActionsResponse();
    this.updateCartStatus();
    this.updateWishListStatus();
  }

  /**
   * Add product to wishlist
   */
  public addToWishList(): void {
    const loggedInUserEmail = this.authUtilService.getLoggedInEmail();
    const productInWishList = this.wishlistProducts.find((wishlistProduct) => {
      return wishlistProduct.id === this.productInfo.id;
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

  /**
   * Navigate to detail page
   */
  public goToDetailPage(productInfo: IProductInfo): void {
    this.store.dispatch(
      ProductsActions.selectProduct({ selectedproduct: productInfo })
    );
    this.router.navigate([`products`, `details`, `${productInfo.id}`]);
  }

  /**
   * Add product to cart
   */
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
    } else {
      this.bannerService.displayBanner.next({
        closeIcon: true,
        closeTime: 2000,
        message: 'Please login to perform the action',
        type: BannerType.WARN,
      });
    }
  }

  /**
   * Remove product from cart
   */
  public removeFromCart(): void {
    const cartProductId = this.cartProducts.find((cartP) => {
      return cartP.productId === this.productInfo.id;
    })?.id;
    if (cartProductId) {
      this.store.dispatch(
        CartWishlistActions.removeFromCart({
          productId: cartProductId,
        })
      );
    }
  }

  /**
   * Update cart status for current product
   */
  private updateCartStatus(): void {
    const productInCart = this.cartProducts.find((p) => {
      return p.productId === this.productInfo.id;
    });
    this.productInfo = { ...this.productInfo, isInCart: !!productInCart };
  }

  /**
   * Update wishlist status for current product
   */
  private updateWishListStatus(): void {
    const productInWishList = this.wishlistProducts.find((wishListProduct) => {
      return wishListProduct.id === this.productInfo.id;
    });
    console.error("update wishlist status", this.wishlistProducts, this.productInfo, productInWishList)
    this.productInfo = {
      ...this.productInfo,
      isInWishList: !!productInWishList,
      wishListId: productInWishList?.wishListId,
    };
  }

  /**
   * Remove product from wishlist
   */
  private removeFromWishList(): void {
    const productInWishList = this.wishlistProducts.find((wishListProduct) => {
      return wishListProduct.id === this.productInfo.id;
    });
    if (productInWishList) {
      this.store.dispatch(
        CartWishlistActions.removeFromWishlist({
          productId: productInWishList.wishListId as number,
        })
      );
    }
  }

  /**
   * Listen to actions response, such as load products, cart, wishlist success
   */
  private listenToActionsResponse(): void {
    this.actionsSubject$
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter(
          (action) =>
            action.type === CartWishlistActions.loadCartProducts.type ||
            action.type === CartWishlistActions.removeFromCart.type
        )
      )
      .subscribe(() => {
        this.loadCartProductsFromStore();
      });

    this.actionsSubject$
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter(
          (action) => action.type === CartWishlistActions.addProductToCart.type
        )
      )
      .subscribe(() => {
        this.bannerService.displayBanner.next({
          closeIcon: true,
          closeTime: 1000,
          message: 'Product added to cart successfully',
          type: BannerType.SUCCESS,
        });
        this.loadCartProductsFromStore();
      });

    this.actionsSubject$
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter(
          (action) =>
            action.type === CartWishlistActions.removeFromWishlist.type ||
            action.type === CartWishlistActions.loadWishListProducts.type ||
            action.type === CartWishlistActions.addProductToWishlist.type
        )
      )
      .subscribe(() => {
        this.loadWishlistProductsFromStore();
      });
  }

  /**
   * Load cart products from store
   */
  private loadCartProductsFromStore(): void {
    this.store
      .select(selectCartProducts)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((cartProducts) => {
        this.cartProducts = cartProducts;
        this.updateCartStatus();
      });
  }

  /**
   * Load wishlist products from store
   */
  private loadWishlistProductsFromStore(): void {
    this.store
      .select(selectWishlistProducts)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((wishlistProducts) => {
        this.wishlistProducts = wishlistProducts;
        this.updateWishListStatus();
      });
  }
}

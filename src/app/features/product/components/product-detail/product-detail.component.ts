import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { BannerType } from 'src/app/shared/interfaces/client/banner.interface';
import {
  IOrderProduct,
  IOrderSummary,
} from 'src/app/shared/interfaces/client/order.interface';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { BannerService } from 'src/app/shared/services/banner.service';
import { IProductDetailsTab } from '../../interfaces/product-info.interface';
import { ActionsSubject, Store } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import * as ProductActions from './../../store/products.actions';
import {
  getSelectedProduct,
  getSimilarProducts,
} from '../../store/products.selectors';
import {
  selectCartProducts,
  selectWishlistProducts,
} from 'src/app/features/cart-wishlist/store/cart-wishlist.selectors';
import * as CartWishlistActions from './../../../cart-wishlist/store/cart-wishlist.actions';
import { ICartProduct } from 'src/app/features/cart-wishlist/interfaces/cart-product.interface';
import { AuthUtilService } from 'src/app/utils/auth-util.service';

@Component({
  selector: 'rimss-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  providers: [],
})
export class ProductDetailComponent extends BaseComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() product: IProductInfo = null as any as IProductInfo;
  public similarProducts: Array<IProductInfo> = [];
  public noOfUnitsInStock = 0;
  public qty = 1;
  public IProductDetailsTab = IProductDetailsTab;
  public activeTab: IProductDetailsTab = IProductDetailsTab.SPECIFICATION;
  private orderSummary?: IOrderSummary;
  private deliveryCharges = 40;

  constructor(
    private authUtilService: AuthUtilService,
    private bannerService: BannerService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<IAppState>,
    private actionsSubject$: ActionsSubject
  ) {
    super();
  }

  private cartProducts: ICartProduct[] = [];
  private wishListProducts: IProductInfo[] = [];

  /**
   * Fetch various data from store, product detail, cart status, wishlist status
   */
  public ngOnInit(): void {
    this.listenToActionsResponse();
    this.store.dispatch(CartWishlistActions.fetchCartProducts());
    this.store.dispatch(CartWishlistActions.fetchWishlistProducts());

    if (!this.product?.id) {
      const productId: number = this.route.snapshot.params['id'];
      this.store.dispatch(
        ProductActions.fetchProductById({
          productId: productId,
        })
      );
    }
  }

  /**
   * Navigate to checkout page
   */
  public gotoCheckout(): void {
    const preTaxAmount =
      this.product.priceAfterDiscount * this.qty + this.deliveryCharges;
    const tax = preTaxAmount / 10;
    const orderAmount = preTaxAmount + tax;
    this.orderSummary = {
      deliveryCharges: this.deliveryCharges,
      tax: tax,
      discountedPrice: this.product.priceAfterDiscount,
      originalPrice: this.product.price,
      orderAmount,
      productOrders: this.prepareOrderProducts(),
      couponCode: '',
      couponDiscount: 0,
      fromcart: false,
      qtyIfDirectOrder: this.qty,
    };
    this.router.navigate(['orders', 'checkout'], {
      state: {
        orderSummary: this.orderSummary,
      },
    });
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
            cartProductImage: this.product.mainImage,
            productBrief: this.product.productBrief,
            productId: this.product.id,
            productName: this.product.productName,
            quantity: this.qty,
            unitCurrency: this.product.currency,
            unitPrice: this.product.price,
            userEmail: loggedInUserEmail,
            discountedPrice: this.product.priceAfterDiscount,
          },
        })
      );
    } else {
      this.bannerService.displayBanner.next({
        closeIcon: true,
        closeTime: 300000000,
        message: 'Please login to perform the action',
        type: BannerType.WARN,
      });
    }
  }

  /**
   * Add product to wishlist
   */
  public addToWishList(): void {
    const loggedInUserEmail = this.authUtilService.getLoggedInEmail();
    if (loggedInUserEmail) {
      this.store.dispatch(
        CartWishlistActions.addProductToWishlist({
          productId: this.product.id,
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

  /**
   * Remove product from cart
   */
  public removeFromCart(): void {
    const cartProductId = this.cartProducts.find((cartP) => {
      return cartP.productId === this.product.id;
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
   * Remove product from wish list
   */
  public removeFromWishList(): void {
    const productInWishList = this.wishListProducts.find((wishListProduct) => {
      return wishListProduct.id === this.product.id;
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
   * Activate specific section of product detail
   * @param tab : IProductDetailsTab
   */
  public activateTab(tab: IProductDetailsTab): void {
    this.activeTab = tab;
  }

  /**
   * Update product qty
   * @param count : number
   */
  public updateQty(count: number): void {
    if (
      (count === -1 && this.qty > 1) ||
      (count === 1 && this.qty < this.noOfUnitsInStock)
    ) {
      this.qty += count;
    }
  }

  /**
   * Fetch similar product based on selected category
   * @param categories : string[]
   */
  private fetchSimilarProducts(categories: string[]): void {
    this.store.dispatch(
      ProductActions.fetchSimilarProducts({
        filterCriteria: {
          category: categories,
        },
      })
    );
  }

  /**
   * Update available stock for a product
   */
  private updateStockQty(): void {
    let noOfQty = 0;
    this.product.sku?.forEach((sku) => {
      noOfQty += sku.units_in_stock;
    });
    this.noOfUnitsInStock = noOfQty;
  }

  /**
   * Adapter function to create order product
   * @returns IOrderProduct[]
   */
  private prepareOrderProducts(): IOrderProduct[] {
    const orderProducts: IOrderProduct[] = [];
    const orderProduct: IOrderProduct = {
      deliveryInfo: {
        orderUpdateEvents: [],
      },
      discountedPrice: this.product.priceAfterDiscount,
      originalPrice: this.product.price,
      productId: this.product.id,
      productSummary: this.product.productBrief,
      productImage: this.product.mainImage,
      qty: this.qty,
    };
    orderProducts.push(orderProduct);
    return orderProducts;
  }

  /**
   * Update cart status for current product
   */
  private updateCartStatus(): void {
    const productInCart = this.cartProducts.find((cartProduct) => {
      return cartProduct.productId === this.product?.id;
    });
    this.product = { ...this.product, isInCart: !!productInCart };
  }

  /**
   * Update wishlist status for current product
   */
  private updateWishListStatus(): void {
    const productInWishList = this.wishListProducts.find((wishlListProduct) => {
      return wishlListProduct.id === this.product?.id;
    });
    this.product = { ...this.product, isInWishList: !!productInWishList };
  }

  /**
   * Listen to actions response, such as load discount success
   */
  private listenToActionsResponse(): void {
    this.actionsSubject$
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter((action) => action.type === ProductActions.fetchProductById.type)
      )
      .subscribe(() => {
        this.loadSelectedProductFromStore();
      });

    this.actionsSubject$
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter(
          (action) =>
            action.type === ProductActions.loadRecommendedProducts.type
        )
      )
      .subscribe(() => {
        this.loadSimilarProductsFromStore();
      });

    this.actionsSubject$
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter(
          (action) =>
            action.type === CartWishlistActions.loadCartProducts.type ||
            action.type === CartWishlistActions.addProductToCart.type ||
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
          (action) =>
            action.type === CartWishlistActions.loadWishListProducts.type ||
            action.type === CartWishlistActions.addProductToWishlist.type ||
            action.type === CartWishlistActions.removeFromWishlist.type
        )
      )
      .subscribe(() => {
        this.loadWishlistProductsFromStore();
      });
  }

  /**
   * Load selected products from store
   */
  private loadSelectedProductFromStore(): void {
    this.store
      .select(getSelectedProduct)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((selectedProduct) => {
        if (selectedProduct) {
          this.product = selectedProduct;
          this.updateCartStatus();
          this.updateWishListStatus();
          this.updateStockQty();
          const categories = this.product.productCategory?.length
            ? [this.product.productCategory[0]]
            : [];
          this.fetchSimilarProducts(categories);
        }
      });
  }

  /**
   * Load similar products from store
   */
  private loadSimilarProductsFromStore(): void {
    this.store
      .select(getSimilarProducts)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((similarProducts) => {
        this.similarProducts = similarProducts || [];
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
        this.wishListProducts = wishlistProducts;
        this.updateWishListStatus();
      });
  }
}

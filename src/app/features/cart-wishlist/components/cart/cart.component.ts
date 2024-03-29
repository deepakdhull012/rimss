import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import {
  ICoupon,
  IOrderProduct,
  IOrderSummary,
} from 'src/app/shared/interfaces/client/order.interface';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { ICartProduct } from '../../interfaces/cart-product.interface';
import { ActionsSubject, Store } from '@ngrx/store';
import * as CartWishlistActions from './../../store/cart-wishlist.actions';
import {
  selectCartProducts,
  selectCoupons,
} from '../../store/cart-wishlist.selectors';
import { IAppState } from 'src/app/core/store/app.state';
import { BannerService } from 'src/app/shared/services/banner.service';
import {
  BannerType,
  IBannerConfig,
} from 'src/app/shared/interfaces/client/banner.interface';

@Component({
  selector: 'rimss-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent extends BaseComponent implements OnInit {
  constructor(
    private router: Router,
    private store: Store<IAppState>,
    private bannerService: BannerService,
    private actionsSubject$: ActionsSubject
  ) {
    super();
  }
  public cartProducts: Array<ICartProduct> = [];
  public recommendedProducts: Array<IProductInfo> = [];
  public originalPriceSum = 0;
  public discountedPriceSum = 0;
  public tax = 0;
  public deliveryCharges = 40;
  public orderSummary?: IOrderSummary;
  public orderAmount: number = 0;
  public couponDiscount = 0;
  public coupons: ICoupon[] = [];
  public appliedCoupon?: ICoupon;
  public currencyLabel = 'Rs/-';
  private taxRate = 10;

  public ngOnInit(): void {
    this.listenToActionsResponse();
    this.fetchCartProducts();
    this.fetchCoupons();
  }

  /**
   * Call the Checkout
   */
  public checkout(): void {
    this.orderSummary = {
      deliveryCharges: this.deliveryCharges,
      tax: this.tax,
      discountedPrice: this.discountedPriceSum,
      originalPrice: this.originalPriceSum,
      orderAmount: this.orderAmount,
      productOrders: this.prepareOrderProducts(),
      couponCode: this.appliedCoupon?.name,
      couponDiscount: this.couponDiscount,
      fromcart: true,
    };
    this.router.navigate(['orders', 'checkout'], {
      state: {
        orderSummary: this.orderSummary,
      },
    });
  }

  /**
   * remove a product from cart
   * @param cartProduct : ICartProduct
   */
  public removeFromCart(cartProduct: ICartProduct): void {
    this.store.dispatch(
      CartWishlistActions.removeFromCart({
        productId: cartProduct.id as number,
      })
    );
  }

  /**
   * Apply the coupon code
   * @param couponName : string
   */
  public applyCoupon(couponName: string): void {
    this.appliedCoupon = this.coupons.find((coupon) => {
      return coupon.name === couponName;
    });
    const bannerConfig: IBannerConfig = {
      closeIcon: true,
      closeTime: 2000,
      message: this.appliedCoupon
        ? `Coupon applied successfully`
        : `Invalid coupon code`,
      type: this.appliedCoupon ? BannerType.SUCCESS : BannerType.ERROR,
    };
    if (this.appliedCoupon) {
      this.updateAmounts();
    }
    this.bannerService.displayBanner.next(bannerConfig);
  }

  /**
   * Provide the coupon lebel to display on screen
   * @param coupon : ICoupon
   * @returns string
   */
  private getCouponLabel(coupon: ICoupon): string {
    switch (coupon.type) {
      case 'flat':
        return `Flat ${coupon.amount} Rs/- off ${
          coupon.minAmount > 0 && 'on min amount of'
        } ${coupon.minAmount}`;
      case 'percentage':
        return `${coupon.amount}% off  ${
          coupon.minAmount > 0 ? `on min amount of ${coupon.minAmount}` : ''
        } `;
    }
  }

  /**
   * Go to detail page for cart product
   * @param cartProduct : ICartProduct
   */
  public goToProductDetailPage(cartProduct: ICartProduct): void {
    this.router.navigate(['products', 'details', cartProduct.id]);
  }

  /**
   * Update the cart quantity for cart product
   * @param selectEvent : Event
   * @param cartItemIndex : number
   */
  public updateQuantity(selectEvent: Event, cartItemIndex: number) {
    if (selectEvent.target) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const qty: number = (selectEvent.target as any).value;
      this.cartProducts = this.cartProducts.map((cartProduct, index) => {
        if (index === cartItemIndex) {
          cartProduct = { ...cartProduct, quantity: qty };
          return cartProduct;
        } else {
          return cartProduct;
        }
      });
    }
    this.updateAmounts();
  }

  /**
   * Listen to actions response, such as cart success, coupons load success etc.
   */
  private listenToActionsResponse(): void {
    this.actionsSubject$
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter(
          (action) => action.type === CartWishlistActions.loadCartProducts.type
        )
      )
      .subscribe(() => {
        this.loadCartproductsFromStore();
      });
    this.actionsSubject$
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter((action) => action.type === CartWishlistActions.loadCoupons.type)
      )
      .subscribe(() => {
        this.loadCouponsFromStore();
      });
  }

  /**
   * Adapter funciton to map cart products to order products
   * @returns IOrderProduct[]
   */
  private prepareOrderProducts(): IOrderProduct[] {
    const orderProducts: IOrderProduct[] = [];
    this.cartProducts.forEach((cartProduct) => {
      const orderProduct: IOrderProduct = {
        deliveryInfo: {
          orderUpdateEvents: [],
        },
        discountedPrice: cartProduct.unitPrice,
        originalPrice: cartProduct.unitPrice,
        productId: cartProduct.productId,
        productSummary: cartProduct.productBrief,
        productImage: cartProduct.cartProductImage,
        qty: cartProduct.quantity,
      };
      orderProducts.push(orderProduct);
    });

    return orderProducts;
  }

  /**
   * Fetch cart products from store
   */
  private fetchCartProducts(): void {
    this.store.dispatch(CartWishlistActions.fetchCartProducts());
  }

  /**
   * Load Cart products from store
   */
  private loadCartproductsFromStore(): void {
    this.store
      .select(selectCartProducts)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (cartProducts) => {
          this.cartProducts = cartProducts;
          this.updateAmounts();
        },
      });
  }

  /**
   * fetch coupons from store
   */
  private fetchCoupons(): void {
    this.store.dispatch(CartWishlistActions.fetchCoupons());
  }

  /**
   * Load coupons from store
   */
  private loadCouponsFromStore(): void {
    this.store
      .select(selectCoupons)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (coupons) => {
          this.coupons = coupons.map((coupon) => {
            coupon = { ...coupon, couponLabel: this.getCouponLabel(coupon) };
            return coupon;
          });
        },
      });
  }

  /**
   * Check coupon discount
   */
  private checkCoupon(): void {
    if (this.appliedCoupon) {
      if (this.discountedPriceSum >= this.appliedCoupon.minAmount) {
        this.couponDiscount =
          this.appliedCoupon.type === 'flat'
            ? this.appliedCoupon.amount
            : (this.discountedPriceSum * this.appliedCoupon.amount) / 100;
      } else {
        this.couponDiscount = 0;
      }
    } else {
      this.couponDiscount = 0;
    }
  }

  /**
   * Update various amounts on UI screen
   */
  private updateAmounts(): void {
    this.originalPriceSum = 0;
    this.discountedPriceSum = 0;
    this.cartProducts.forEach((product) => {
      this.originalPriceSum += product.unitPrice * product.quantity;
      this.discountedPriceSum += product.discountedPrice * product.quantity;
    });
    this.tax = (this.discountedPriceSum * this.taxRate) / 100;
    this.checkCoupon();
    this.orderAmount =
      this.discountedPriceSum +
      this.deliveryCharges +
      this.tax -
      this.couponDiscount;
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import {
  ICoupon,
  IOrderProduct,
  IOrderSummary,
} from 'src/app/shared/interfaces/client/order.interface';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { ProductsService } from 'src/app/shared/services/products.service';
import { ICartProduct } from '../../interfaces/cart-product.interface';
import { CartWishlistService } from '../../services/cart-wishlist.service';

@Component({
  selector: 'rimss-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent extends BaseComponent implements OnInit {
  constructor(
    private router: Router,
    private cartService: CartWishlistService,
    private productsService: ProductsService
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
  private coupons: ICoupon[] = [];
  public appliedCoupon?: ICoupon;

  ngOnInit(): void {
    this.fetchCartProducts();
    this.fetchCoupons();
  }

  checkout(): void {
    this.orderSummary = {
      deliveryCharges: this.deliveryCharges,
      tax: this.tax,
      discountedPrice: this.discountedPriceSum,
      originalPrice: this.originalPriceSum,
      orderAmount: this.orderAmount,
      productOrders: this.prepareOrderProducts(),
      couponCode: this.appliedCoupon?.name,
      couponDiscount: this.couponDiscount,
      fromcart: true
    };
    this.router.navigate(['checkout'], {
      state: {
        orderSummary: this.orderSummary,
      },
    });
  }

  prepareOrderProducts(): IOrderProduct[] {
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
        qty: cartProduct.quantity
      };
      orderProducts.push(orderProduct);
    });

    return orderProducts;
  }

  removeFromCart(cartProduct: ICartProduct): void {
    this.cartService
      .removeFromCart(cartProduct.id as number)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((res) => {
        this.fetchCartProducts();
      });
  }

  fetchCartProducts(): void {
    this.cartService
      .getCartProducts()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((cartProducts) => {
        this.cartProducts = cartProducts;
        this.updateAmounts();
      });
  }

  fetchCoupons(): void {
    this.productsService
      .fetchCoupons()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((coupons) => {
        this.coupons = coupons;
      });
  }

  fetchRecommendedProducts(): void {}

  applyCoupon(couponName: string): void {
    this.appliedCoupon = this.coupons.find((coupon) => {
      return coupon.name === couponName;
    });
    this.updateAmounts();
  }

  checkCoupon(): void {
    if (this.appliedCoupon) {
      console.error(this.discountedPriceSum, this.appliedCoupon.minAmount)
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

  updateQuantity(selectEvent: Event, cartItemIndex: number) {
    if (selectEvent.target) {
      const qty: number = (selectEvent.target as any).value;
      this.cartProducts[cartItemIndex].quantity = qty;
    }
    this.updateAmounts();
  }

  private updateAmounts(): void {
    this.originalPriceSum = 0;
    this.discountedPriceSum = 0;
    this.cartProducts.forEach((product) => {
      this.originalPriceSum += product.unitPrice * product.quantity;
      this.discountedPriceSum += product.discountedPrice * product.quantity;
    });
    this.tax = this.discountedPriceSum / 10;
    this.checkCoupon();
    this.orderAmount =
      this.discountedPriceSum +
      this.deliveryCharges +
      this.tax -
      this.couponDiscount;
  }
}

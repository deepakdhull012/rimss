import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { BannerType } from 'src/app/shared/interfaces/client/banner.interface';
import {
  IOrderProduct,
  IOrderSummary,
} from 'src/app/shared/interfaces/client/order.interface';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { BannerService } from 'src/app/shared/services/banner.service';
import { IProductDetailsTab } from '../../interfaces/product-info.interface';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import * as ProductsAction from './../../store/products.actions';
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
    private store: Store<IAppState>
  ) {
    super();
  }

  private cartProducts: ICartProduct[] = [];
  private wishListProducts: IProductInfo[] = [];

  public ngOnInit(): void {
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

    this.store.select(getSimilarProducts).subscribe((similarProducts) => {
      console.error('similarProducts', similarProducts);
      this.similarProducts = similarProducts || [];
    });
    this.store.dispatch(CartWishlistActions.fetchCartProducts());
    this.store.dispatch(CartWishlistActions.fetchWishlistProducts());
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
        this.wishListProducts = wishlistProducts;
        this.updateWishListStatus();
      });

    if (!this.product?.id) {
      const productId: number = this.route.snapshot.params['id'];
      this.store.dispatch(
        ProductsAction.fetchProductById({
          productId: productId,
        })
      );
    }
  }

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
    };
    this.router.navigate(['checkout'], {
      state: {
        orderSummary: this.orderSummary,
      },
    });
  }

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
      this.store
        .select(selectCartProducts)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: (_) => {
            this.bannerService.displayBanner.next({
              closeIcon: true,
              closeTime: 1000,
              message: 'Product added to cart successfully',
              type: BannerType.SUCCESS,
            });
          },
        });
    } else {
      this.bannerService.displayBanner.next({
        closeIcon: true,
        closeTime: 300000000,
        message: 'Please login to perform the action',
        type: BannerType.WARN,
      });
    }
  }

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

  public removeFromWishList(): void {
    const productInWishList = this.wishListProducts.find((wishListProduct) => {
      return wishListProduct.id === this.product.id;
    });
    if (productInWishList) {
      this.store.dispatch(
        CartWishlistActions.removeFromWishlist({
          productId: productInWishList.id,
        })
      );
    }
  }

  public activateTab(tab: IProductDetailsTab): void {
    this.activeTab = tab;
  }

  public updateQty(count: number): void {
    if (
      (count === -1 && this.qty > 1) ||
      (count === 1 && this.qty < this.noOfUnitsInStock)
    ) {
      this.qty += count;
    }
  }

  private fetchSimilarProducts(categories: string[]): void {
    console.error('fetch similar prod function', categories);
    this.store.dispatch(
      ProductsAction.fetchSimilarProducts({
        filterCriteria: {
          category: categories,
        },
      })
    );
  }

  private updateStockQty(): void {
    let noOfQty = 0;
    this.product.sku?.forEach((sku) => {
      noOfQty += sku.units_in_stock;
    });
    this.noOfUnitsInStock = noOfQty;
  }

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

  private updateCartStatus(): void {
    const productInCart = this.cartProducts.find((p) => {
      return p.id === this.product.id;
    });
    this.product = { ...this.product, isInCart: !!productInCart };
  }

  private updateWishListStatus(): void {
    const productInWishList = this.wishListProducts.find((p) => {
      return p.id === this.product.id;
    });
    this.product = { ...this.product, isInWishList: !!productInWishList };
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { CartWishlistService } from 'src/app/features/cart-wishlist/services/cart-wishlist.service';
import { BannerType } from 'src/app/shared/interfaces/client/banner.interface';
import {
  IOrderProduct,
  IOrderSummary,
} from 'src/app/shared/interfaces/client/order.interface';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { BannerService } from 'src/app/shared/services/banner.service';
import { ProductsService } from 'src/app/api/products.service';
import { IProductDetailsTab } from '../../interfaces/product-info.interface';
import { ProductDetailService } from '../../services/product-detail.service';

@Component({
  selector: 'rimss-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  providers: [ProductDetailService]
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
    private productService: ProductsService,
    private authService: AuthService,
    private bannerService: BannerService,
    private cartWishlistService: CartWishlistService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  public ngOnInit(): void {
    this.product = this.productService.productSelected;

    this.cartWishlistService.cartUpdated
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((_) => {
        this.cartWishlistService.getCartProducts().subscribe((_) => {
          this.updateCartStatus();
        });
      });
    this.cartWishlistService.wishListUpdated
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((_) => {
        this.cartWishlistService.getWishListProducts().subscribe((_) => {
          this.updateWishListStatus();
        });
      });

    if (!this.product?.id) {
      const pId = this.route.snapshot.params['id'];
      this.productService
        .fetchProductById(pId)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: (product) => {
            this.product = product;
            this.updateCartStatus();
            this.updateWishListStatus();
            this.updateStockQty();
            const categories = this.product.productCategory?.length
              ? [this.product.productCategory[0]]
              : [];
            this.fetchSimilarProducts(categories);
          },
        });
    } else {
      this.updateStockQty();
      this.updateCartStatus();
      this.updateWishListStatus();
      const categories = this.product.productCategory?.length
        ? [this.product.productCategory[0]]
        : [];
      this.fetchSimilarProducts(categories);
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
    const loggedInUserEmail = this.authService.getLoggedInEmail();
    if (loggedInUserEmail) {
      this.cartWishlistService
        .addProductToCart({
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
        })
        .subscribe({
          next: (res) => {
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
    const loggedInUserEmail = this.authService.getLoggedInEmail();
    if (loggedInUserEmail) {
      this.cartWishlistService
        .addProductToWishList(this.product.id, loggedInUserEmail)
        .subscribe();
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
    const cartProductId = this.cartWishlistService.cartProducts.find(
      (cartP) => {
        return cartP.productId === this.product.id;
      }
    )?.id;
    if (cartProductId) {
      this.cartWishlistService.removeFromCart(cartProductId).subscribe();
    }
  }

  public removeFromWishList(): void {
    const productInWishList = this.cartWishlistService.wishListProducts.find(
      (wishListProduct) => {
        return wishListProduct.productId === this.product.id;
      }
    );
    if (productInWishList) {
      this.cartWishlistService
        .removeFromWishList(productInWishList?.id)
        .subscribe({
          next: (_) => {
            this.cartWishlistService.wishListUpdated.next();
          },
        });
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
    this.productService
      .filterProductsByCriteria({
        category: categories,
      })
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (products) => {
          this.similarProducts = products;
        },
      });
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
    const productInCart = this.cartWishlistService.cartProducts.find((p) => {
      return p.id === this.product.id;
    });
    this.product.isInCart = !!productInCart;
  }

  private updateWishListStatus(): void {
    const productInWishList = this.cartWishlistService.wishListProducts.find(
      (p) => {
        return p.productId === this.product.id;
      }
    );
    this.product.isInWishList = !!productInWishList;
  }
}

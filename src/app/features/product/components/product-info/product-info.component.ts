import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Route, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { CartWishlistService } from 'src/app/features/cart-wishlist/services/cart-wishlist.service';
import { BannerType } from 'src/app/shared/interfaces/client/banner.interface';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { BannerService } from 'src/app/shared/services/banner.service';
import { ProductsService } from 'src/app/shared/services/products.service';
import { IProductInfoConfig } from '../../interfaces/product-info.interface';
import { ProductDetailService } from '../../services/product-detail.service';

@Component({
  selector: 'rimss-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss'],
})
export class ProductInfoComponent extends BaseComponent implements OnInit {
  @Input() productInfo: IProductInfo = {} as IProductInfo;
  @Input() productInfoConfig?: IProductInfoConfig;

  constructor(
    private cartWishListService: CartWishlistService,
    private productService: ProductsService,
    private authService: AuthService,
    private bannerService: BannerService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.updateCartStatus();
    this.updateWishListStatus();
    this.cartWishListService.cartUpdated.pipe(takeUntil(this.componentDestroyed$)).subscribe(_ => {
      this.cartWishListService.getCartProducts().subscribe(_ => {
        this.updateCartStatus();
      });
    })
    this.cartWishListService.wishListUpdated.pipe(takeUntil(this.componentDestroyed$)).subscribe(_ => {
      this.cartWishListService.getWishListProducts().subscribe(_ => {
        this.updateWishListStatus();
      });
    })
  }

  addToWishList(): void {
    const loggedInUserEmail =  this.authService.getLoggedInEmail();
    if (loggedInUserEmail) {
    this.cartWishListService
      .addProductToWishList(this.productInfo.id, loggedInUserEmail)
      .subscribe(_ => {
        this.bannerService.displayBanner.next({
          closeIcon: true,
          closeTime: 1000,
          message: "Product added to wishlist",
          type: BannerType.SUCCESS
        })
      });
    } else {
      this.bannerService.displayBanner.next({
        closeIcon: true,
        closeTime: 300000000,
        message: "Please login to perform the action",
        type: BannerType.WARN
      })
    }
  }

  goToDetailPage(productInfo: IProductInfo): void {
    
    this.productService.productSelected = productInfo;
    this.router.navigate([`products`, `details`, `${productInfo.id}`]);
  }

  addToCart(): void { 
    const loggedInUserEmail =  this.authService.getLoggedInEmail();
    if (loggedInUserEmail) {
      this.cartWishListService
      .addProductToCart({
        cartAddDate: new Date(),
        cartProductImage: this.productInfo.mainImage,
        productBrief: this.productInfo.productBrief,
        productId: this.productInfo.id,
        productName: this.productInfo.productName,
        quantity: 1,
        unitCurrency: this.productInfo.currency,
        unitPrice: this.productInfo.price,
        userEmail: loggedInUserEmail,
      })
      .subscribe((res) => {
        this.bannerService.displayBanner.next({
          closeIcon: true,
          closeTime: 1000,
          message: "Product added to cart",
          type: BannerType.SUCCESS
        })
      }); 
    } else {

      this.bannerService.displayBanner.next({
        closeIcon: true,
        closeTime: 2000,
        message: "Please login to perform the action",
        type: BannerType.WARN
      })
    }
    
  }

  updateCartStatus(): void {
    const productInCart = this.cartWishListService.cartProducts.find(p => {
      return p.id === this.productInfo.id
    });
    this.productInfo.isInCart = !!productInCart;
  }

  updateWishListStatus(): void {
    const productInWishList = this.cartWishListService.wishListProducts.find(p => {
      return p.id === this.productInfo.id
    });
    this.productInfo.isInWishList = !!productInWishList;
  }

  removeFromCart(): void {
    const cartProductId = this.cartWishListService.cartProducts.find(cartP => {
      return cartP.productId === this.productInfo.id
    })?.id;
    if (cartProductId) {
      this.cartWishListService.removeFromCart(cartProductId).subscribe();
    }
  }
}

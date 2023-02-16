import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Route, Router } from '@angular/router';
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
    const productInCart = this.cartWishListService.cartProducts.find(p => {
      return p.id === this.productInfo.id
    });
    const productInWishList = this.cartWishListService.wishListProducts.find(p => {
      return p.id === this.productInfo.id
    });
    this.productInfo.isInCart = !!productInCart;
    this.productInfo.isInWishList = !!productInWishList;
  }

  addToWishList(): void {
    const loggedInUserEmail =  this.authService.getLoggedInEmail();
    if (loggedInUserEmail) {
    this.cartWishListService
      .addProductToWishList(this.productInfo.id, loggedInUserEmail)
      .subscribe();
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
        this.router.navigate(['user', 'cart']);
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

  removeFromCart(): void {

  }
}

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { CartWishlistService } from 'src/app/features/cart-wishlist/services/cart-wishlist.service';
import { BannerType } from 'src/app/shared/interfaces/client/banner.interface';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { BannerService } from 'src/app/shared/services/banner.service';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'rimss-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent extends BaseComponent implements OnInit {
  @Input() product: IProductInfo = null as any as IProductInfo;
  public similarProducts: Array<IProductInfo> = [];
  public noOfUnitsInStock = 0;

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

  ngOnInit(): void {
    this.product = this.productService.productSelected;
    
    if (!this.product?.id) {
      const pId = this.route.snapshot.params['id'];
      
      this.productService
        .fetchProductById(pId)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe((product) => {
          this.product = product;
          this.updateStockQty();
          console.error('this.route', this.route, this.product);
          const categories = this.product.productCategory?.length
            ? [this.product.productCategory[0]]
            : [];
            console.error("categories", categories)
          this.productService
            .fetchCategoryProducts(categories)
            .pipe(takeUntil(this.componentDestroyed$)).subscribe(products => {
              this.similarProducts = products;
            });
        });
    } else {
      this.updateStockQty();
      const categories = this.product.productCategory?.length
            ? [this.product.productCategory[0]]
            : [];
            console.error("categories", categories)
          this.productService
            .fetchCategoryProducts(categories)
            .pipe(takeUntil(this.componentDestroyed$)).subscribe(products => {
              this.similarProducts = products;
            });
    }
  }

  updateStockQty(): void {
    let noOfQty = 0;
    this.product.sku?.forEach(sku => {
      noOfQty+= sku.units_in_stock;
    });
    this.noOfUnitsInStock = noOfQty;
  }

  gotoCheckout(): void {
    this.router.navigate(['checkout']);
  }

  addToCart(): void {
    const loggedInUserEmail = this.authService.getLoggedInEmail();
    if (loggedInUserEmail) {
      this.cartWishlistService
        .addProductToCart({
          cartAddDate: new Date(),
          cartProductImage: this.product.mainImage,
          productBrief: this.product.productBrief,
          productId: this.product.id,
          productName: this.product.productName,
          quantity: 1,
          unitCurrency: this.product.currency,
          unitPrice: this.product.price,
          userEmail: loggedInUserEmail,
        })
        .subscribe((res) => {
          this.router.navigate(['user', 'cart']);
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

  addToWishList(): void {
    const loggedInUserEmail = this.authService.getLoggedInEmail();
    if (loggedInUserEmail) {
      this.cartWishlistService
        .addProductToWishList(this.product.id, loggedInUserEmail)
        .subscribe();
    } else {
      this.bannerService.displayBanner.next({
        closeIcon: true,
        closeTime: 300000000,
        message: 'Please login to perform the action',
        type: BannerType.WARN,
      });
    }
  }
}

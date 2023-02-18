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
import { IProductDetailsTab } from '../../interfaces/product-info.interface';

@Component({
  selector: 'rimss-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent extends BaseComponent implements OnInit {
  @Input() product: IProductInfo = null as any as IProductInfo;
  public similarProducts: Array<IProductInfo> = [];
  public noOfUnitsInStock = 0;
  public qty = 1;
  public IProductDetailsTab = IProductDetailsTab;
  public activeTab: IProductDetailsTab = IProductDetailsTab.SPECIFICATION;

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
        .subscribe((product) => {
          this.product = product;
          this.updateCartStatus();
          this.updateWishListStatus();
          this.updateStockQty();
          console.error('this.route', this.route, this.product);
          const categories = this.product.productCategory?.length
            ? [this.product.productCategory[0]]
            : [];
          console.error('categories', categories);
          this.productService
            .filterProductsByCriteria({
              category: categories,
            })
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe((products) => {
              this.similarProducts = products;
            });
        });
    } else {
      this.updateStockQty();
      this.updateCartStatus();
      this.updateWishListStatus();
      const categories = this.product.productCategory?.length
        ? [this.product.productCategory[0]]
        : [];
      console.error('categories', categories);
      this.productService
        .filterProductsByCriteria({
          category: categories,
        })
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe((products) => {
          this.similarProducts = products;
        });
    }
  }

  updateStockQty(): void {
    let noOfQty = 0;
    this.product.sku?.forEach((sku) => {
      noOfQty += sku.units_in_stock;
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
          quantity: this.qty,
          unitCurrency: this.product.currency,
          unitPrice: this.product.price,
          userEmail: loggedInUserEmail,
        })
        .subscribe((res) => {
          this.bannerService.displayBanner.next({
            closeIcon: true,
            closeTime: 1000,
            message: 'Product added to cart successfully',
            type: BannerType.SUCCESS,
          });
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
        closeTime: 1000,
        message: 'Please login to perform the action',
        type: BannerType.WARN,
      });
    }
  }

  removeFromCart(): void {
    const cartProductId = this.cartWishlistService.cartProducts.find(
      (cartP) => {
        return cartP.productId === this.product.id;
      }
    )?.id;
    if (cartProductId) {
      this.cartWishlistService.removeFromCart(cartProductId).subscribe();
    }
  }

  updateCartStatus(): void {
    const productInCart = this.cartWishlistService.cartProducts.find((p) => {
      return p.id === this.product.id;
    });
    this.product.isInCart = !!productInCart;
  }

  updateWishListStatus(): void {
    const productInWishList = this.cartWishlistService.wishListProducts.find(
      (p) => {
        return p.productId === this.product.id;
      }
    );
    console.error("productInWishList", this.product.id, productInWishList, this.cartWishlistService.wishListProducts)
    this.product.isInWishList = !!productInWishList;
  }


  removeFromWishList(): void {
    const productInWishList = this.cartWishlistService.wishListProducts.find(wishListProduct => {
      return wishListProduct.productId === this.product.id
    });
    if (productInWishList) {
      this.cartWishlistService.removeFromWishList(productInWishList?.id).subscribe(_ => {
        this.cartWishlistService.wishListUpdated.next();
      });
    }
    
  }

  activateTab(tab: IProductDetailsTab): void {
    this.activeTab = tab;
  }

  updateQty(count: number): void {
    if ((count === -1 && this.qty > 1) || (count === 1 && this.qty < this.noOfUnitsInStock)) {
      this.qty+= count;
    }
    
  }
}

import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ngxLightOptions } from 'ngx-light-carousel/public-api';
import { forkJoin, take, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { CartWishlistService } from 'src/app/features/cart-wishlist/services/cart-wishlist.service';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { IWishList } from 'src/app/shared/interfaces/client/wish-list.interface';
import { ProductsService } from 'src/app/shared/services/products.service';
import { IBannerSale } from '../../interfaces/banner-sale.interface';

@Component({
  selector: 'rimss-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent extends BaseComponent implements OnInit {
  public options: ngxLightOptions = {} as ngxLightOptions;
  public bannerSales: Array<IBannerSale> = [];
  public salesLoaded = false;
  public newProducts: Array<IProductInfo> = [];
  public recommendedProducts: Array<IProductInfo> = [];

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private cartWishlistService: CartWishlistService
  ) {
    super();
    this.initCarouselConfig();
  }

  public ngOnInit(): void {
    this.initSliderImages();
    this.initNewProducts();
    this.initRecommendedProducts();
  }

  public goToDetailPage(product: IProductInfo) {
    this.productsService.productSelected = product;
    this.router.navigate(['product', `${product.id}`]);
  }

  public goToSalePage(bannerSale: IBannerSale): void {
    this.router.navigate(['products', 'list'], {
      queryParams: {
        saleId: bannerSale.saleId,
        mode: 'banner-sale',
      },
    });
  }

  private initCarouselConfig(): void {
    this.options = {
      scroll: {
        numberToScroll: 1,
      },
      animation: {
        animationClass: 'transition',
        animationTime: 200,
      },
      swipe: {
        swipeable: true,
        swipeVelocity: 1,
      },
      arrows: true,
      indicators: true,

      infinite: true,
      autoplay: {
        enabled: false,
        direction: 'right',
        delay: 500,
        stopOnHover: true,
      },
      breakpoints: [
        {
          width: 768,
          number: 1,
        },
        {
          width: 991,
          number: 1,
        },
        {
          width: 9999,
          number: 1,
        },
      ],
    };
  }

  private initSliderImages(): void {
    this.productsService
      .fetchAllBannerSales()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (bannerSales) => {
          this.bannerSales = bannerSales;
          this.salesLoaded = true;
          console.error('banner sales', this.bannerSales);
        },
        error: (err) => {
          this.bannerSales = [];
          this.salesLoaded = true;
        },
      });
  }

  private initNewProducts(): void {
    const wishList$ = this.cartWishlistService.getWishListProducts();
    const newProducts$ = this.productsService.fetchAllProducts();
    forkJoin([wishList$, newProducts$])
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (response) => {
          this.newProducts = response[1];
          this.newProducts.forEach((product) => {
            product.isInWishList = this.isInWishList(product.id);
          });
        },
      });
  }

  private isInWishList(productId: number): boolean {
    const wishListProduct = this.cartWishlistService.wishListProducts.find(
      (wishList) => {
        return wishList.productId === productId;
      }
    );
    return !!wishListProduct;
  }

  private initRecommendedProducts(): void {
    const userGender = JSON.parse(
      localStorage.getItem('loggedInUser') || '{}'
    )?.gender;
    let cats: Array<string> = [];
    if (userGender === 'M') {
      cats = ['A'];
    } else if (userGender === 'F') {
      cats = ['G'];
    }
    this.productsService
      .filterProductsByCriteria({
        category: cats,
      })
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((recommendedProducts) => {
        this.recommendedProducts = recommendedProducts;
      });
  }
}

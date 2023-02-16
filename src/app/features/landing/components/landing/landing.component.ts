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
  options: ngxLightOptions = {} as ngxLightOptions;
  bannerSales: Array<IBannerSale> = [];
  public salesLoaded = false;
  public newProducts: Array<IProductInfo> = [];
  public recommendedProducts: Array<IProductInfo> = [];
  private wishList: Array<IWishList> = [];

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private cartWishlistService: CartWishlistService,
    private authService: AuthService
  ) {
    super();
    this.initCarouselConfig();
  }

  ngOnInit(): void {
    this.initSliderImages();
    this.initNewProducts();
    this.initRecommendedProducts();
  }

  initCarouselConfig(): void {
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

  initSliderImages(): void {
    this.productsService
      .fetchAllBannerSales()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        (bannerSales) => {
          this.bannerSales = bannerSales;
          this.salesLoaded = true;
          console.error('banner sales', this.bannerSales);
        },
        (err) => {
          this.bannerSales = [];
          this.salesLoaded = true;
        }
      );
  }

  initNewProducts(): void {
    const wishList$ = this.cartWishlistService.getWishListProducts();
    const newProducts$ = this.productsService.fetchAllProducts();
    forkJoin([wishList$, newProducts$]).subscribe((response) => {
      this.newProducts = response[1];
      this.wishList = response[0];
      this.newProducts.forEach((product) => {
        product.isInWishList = this.isInWishList(product.id);
      });
    });
  }

  isInWishList(productId: number): boolean {
    const wishListProduct = this.wishList.find((wishList) => {
      return wishList.productId === productId;
    });
    return !!wishListProduct;
  }

  initRecommendedProducts(): void {
    const userGender = JSON.parse(localStorage.getItem("loggedInUser") || "{}")?.gender;
    let cats: Array<string> = [];
    if (userGender === 'M') {
      cats = ["Men's"];
    } else if (userGender === 'F') {
      cats = ["Women's"];
    }
    this.productsService
        .fetchCategoryProducts(cats)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe((recommendedProducts) => {
          this.recommendedProducts = recommendedProducts;
        });
  }

  goToDetailPage(product: IProductInfo) {
    this.productsService.productSelected = product;
    this.router.navigate(['product', `${product.id}`]);
  }

  goToSalePage(bannerSale: IBannerSale): void {
    this.router.navigate(['products', 'list'], {
      queryParams: {
        saleId: bannerSale.saleId,
        mode: 'banner-sale',
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ngxLightOptions } from 'ngx-light-carousel/public-api';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { IBannerSale } from '../../interfaces/banner-sale.interface';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import * as ProductsActions from './../../../product/store/products.actions';
import * as CartWishlistActions from './../../../cart-wishlist/store/cart-wishlist.actions';
import {
  getRecommendedProducts,
  selectBannerSales,
  selectProducts,
} from 'src/app/features/product/store/products.selectors';
import { selectWishlistProducts } from 'src/app/features/cart-wishlist/store/cart-wishlist.selectors';

@Component({
  selector: 'rimss-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent extends BaseComponent implements OnInit {
  public options: ngxLightOptions = {} as ngxLightOptions;
  public bannerSales: Array<IBannerSale> = [];
  public newProducts: Array<IProductInfo> = [];
  public recommendedProducts: Array<IProductInfo> = [];
  public loading = false;

  constructor(private router: Router, private store: Store<IAppState>) {
    super();
    this.initCarouselConfig();
  }
  private wishListProducts: IProductInfo[] = [];

  public ngOnInit(): void {
    this.initSliderImages();
    this.initNewProducts();
    this.initRecommendedProducts();
  }

  public goToDetailPage(product: IProductInfo) {
    this.store.dispatch(
      ProductsActions.selectProduct({ selectedproduct: product })
    );
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
    this.loading = true;
    this.store.dispatch(ProductsActions.fetchBannerSales());
    this.store
      .select(selectBannerSales)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (bannerSales) => {
          this.loading = false;
          this.bannerSales = bannerSales;
        },
        error: (err) => {
          this.loading = false;
          this.bannerSales = [];
        },
      });
  }

  private initNewProducts(): void {
    this.loading = true;
    this.store.dispatch(ProductsActions.fetchProducts());
    this.store.dispatch(CartWishlistActions.fetchWishlistProducts());

    this.store
      .select(selectWishlistProducts)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((wishlistProducts) => {
        this.wishListProducts = wishlistProducts;
        this.newProducts.forEach((product) => {
          product = { ...product, isInWishList: this.isInWishList(product.id) };
        });
      });
    this.store
      .select(selectProducts)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((allProducts) => {
        this.newProducts = allProducts;
        this.newProducts.forEach((product) => {
          product = { ...product, isInWishList: this.isInWishList(product.id) };
        });
      });
  }

  private isInWishList(productId: number): boolean {
    const wishListProduct = this.wishListProducts.find((wishList) => {
      return wishList.id === productId;
    });
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
    this.store.dispatch(
      ProductsActions.fetchRecommendedProducts({
        filterCriteria: {
          category: cats,
        },
      })
    );
    this.store
      .select(getRecommendedProducts)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((recommendedProducts) => {
        this.recommendedProducts = recommendedProducts || [];
      });
  }
}

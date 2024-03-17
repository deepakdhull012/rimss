import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ngxLightOptions } from 'ngx-light-carousel/public-api';
import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { IBannerSale } from '../../interfaces/banner-sale.interface';
import { ActionsSubject, Store } from '@ngrx/store';
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

  constructor(
    private router: Router,
    private store: Store<IAppState>,
    private actionsSubject$: ActionsSubject
  ) {
    super();
    this.listenToActionsResponse();
    this.initCarouselConfig();
  }
  private wishListProducts: IProductInfo[] = [];

  public ngOnInit(): void {
    this.initSliderImages();
    this.initNewProducts();
    this.initRecommendedProducts();
  }

  /**
   * Navigate to product detail page
   * @param product : IProductInfo
   */
  public goToDetailPage(product: IProductInfo) {
    this.store.dispatch(
      ProductsActions.selectProduct({ selectedproduct: product })
    );
    this.router.navigate(['product', `${product.id}`]);
  }

  /**
   * Display products for a particular sale from banner
   * @param bannerSale : IBannerSale
   */
  public goToSalePage(bannerSale: IBannerSale): void {
    this.router.navigate(['products', 'list'], {
      queryParams: {
        saleId: bannerSale.saleId,
        mode: 'banner-sale',
      },
    });
  }

  /**
   * Init the carousel
   */
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

  /**
   * Fetch slide images from ngrx store
   */
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
        error: () => {
          this.loading = false;
          this.bannerSales = [];
        },
      });
  }

  /**
   * Fetch latest products from ngrx store
   */
  private initNewProducts(): void {
    this.loading = true;
    this.store.dispatch(ProductsActions.fetchProducts());
    this.store.dispatch(CartWishlistActions.fetchWishlistProducts());
  }

  /**
   * get wishlist id for a product to display heart icon
   * @param productId : number
   * @returns
   */
  private getWishListId(productId: number): number | null {
    const wishListProduct = this.wishListProducts.find((wishList) => {
      return wishList.id === productId;
    });
    return wishListProduct && wishListProduct.wishListId
      ? wishListProduct.wishListId
      : null;
  }

  /**
   * Fetch recommended products from store based on user's gender
   */
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
  }

  /**
   * Listen to actions response, such as load discount success
   */
  private listenToActionsResponse(): void {
    this.actionsSubject$
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter((action) => action.type === ProductsActions.loadProducts.type)
      )
      .subscribe(() => {
        this.loadAllProductsFromstore();
      });

    this.actionsSubject$
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter(
          (action) =>
            action.type === ProductsActions.loadRecommendedProducts.type
        )
      )
      .subscribe(() => {
        this.loadRecommendedProductsFromstore();
      });

      this.actionsSubject$
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter(
          (action) =>
            action.type === ProductsActions.loadBannerSales.type
        )
      )
      .subscribe(() => {
        this.loadBannerSalesFromStore();
      });

      this.actionsSubject$
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter(
          (action) =>
            action.type === CartWishlistActions.loadWishListProducts.type
        )
      )
      .subscribe(() => {
        this.loadWishlistProductsFromStore();
      });
  }

  private loadRecommendedProductsFromstore(): void {
    this.store
      .select(getRecommendedProducts)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((recommendedProducts) => {
        this.recommendedProducts = recommendedProducts || [];
      });
  }

  private loadAllProductsFromstore(): void {
    this.store
      .select(selectProducts)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((allProducts) => {
        this.newProducts = allProducts;
        this.newProducts.forEach((product) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          product = {
            ...product,
            isInWishList: !!this.getWishListId(product.id),
            wishListId: this.getWishListId(product.id),
          };
        });
      });
  }

  private loadWishlistProductsFromStore(): void {
    this.store
      .select(selectWishlistProducts)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((wishlistProducts) => {
        this.wishListProducts = wishlistProducts;
        this.newProducts.forEach((product) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          product = {
            ...product,
            isInWishList: !!this.getWishListId(product.id),
            wishListId: this.getWishListId(product.id),
          };
        });
      });
  }

  private loadBannerSalesFromStore(): void {
    this.store
      .select(selectBannerSales)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (bannerSales) => {
          this.loading = false;
          this.bannerSales = bannerSales;
        },
        error: () => {
          this.loading = false;
          this.bannerSales = [];
        },
      });
  }
}

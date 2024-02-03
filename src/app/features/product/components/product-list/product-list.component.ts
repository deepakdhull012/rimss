import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { ProductsService } from 'src/app/api/products.service';
import { SortBy } from '../../interfaces/product-info.interface';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';

@Component({
  selector: 'rimss-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent extends BaseComponent implements OnInit {
  public products: Array<IProductInfo> = [];
  public page: number = 1;
  public SortBy = SortBy;
  public loading = false;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<IAppState>
  ) {
    super();
  }

  private saleId?: number;
  private categories: Array<string> = [];
  private filterString?: string;
  private sortByValue?: SortBy;
  

  public ngOnInit(): void {
    this.router.events
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.page = 1;
        }
      });
      this.store.select('products').pipe(takeUntil(this.componentDestroyed$)).subscribe(state => {
        console.log("Store provided the products", state)
        if (state.products) {
          this.products = state.products;
          console.log(this.products)
        }
        
      });
    this.route.queryParams.subscribe((params) => {
      const mode: 'banner-sale' | 'category' | 'search' = params['mode'];
      this.saleId = params['saleId'];
      const searchText = params['search'];
      const categoryParam = params['category'];
      this.categories = [];
      if (typeof categoryParam === 'string') {
        this.categories.push(categoryParam);
      } else {
        this.categories = categoryParam;
      }
      if (this.categories?.length > 1) {
        this.categories = [this.categories[this.categories.length - 1]];
      }

        if (mode === 'banner-sale') {
          this.fetchproductsBasedOnCriteria();
        } else if (mode === 'search') {
          this.loading = true;
          this.productsService
            .getProductsBySearch(searchText)
            .subscribe({
              next: (products) => {
                this.products = products;
              },
              complete: () => {
                this.loading = false;
              }
            });
        } else {
          this.fetchproductsBasedOnCriteria();
        }
      })   
  }

  public goToDetailPage(product: IProductInfo) {
    this.productsService.productSelected = product;
    this.router.navigate(['product', `${product.id}`]);
  }

  public onFilterChange(filterString: string): void {
    this.filterString = filterString;
    this.fetchproductsBasedOnCriteria();
  }

  public onSortByChange(sortEvent: Event) {
    if (sortEvent.target) {
      const sortBy: SortBy = (sortEvent.target as any).value;
      this.sortByValue = sortBy;
      this.fetchproductsBasedOnCriteria();
    }
  }

  private fetchproductsBasedOnCriteria(): void {
    // this.loading = true;
    // this.store.dispatch(ProductsActions.requestLoadProducts());
    // this.productsService
    //   .filterProductsByCriteria(
    //     {
    //       category: this.categories,
    //       filterString: this.filterString,
    //       saleId: this.saleId,
    //     },
    //     this.sortByValue
    //   )
    //   .subscribe({
    //     next: (products) => {
    //       this.products = products;
    //     },
    //     complete: () => {
    //       this.loading = false;
    //     }
    //   });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { ProductsService } from 'src/app/shared/services/products.service';
import { SortBy } from '../../interfaces/product-info.interface';

@Component({
  selector: 'rimss-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent extends BaseComponent implements OnInit {
  private saleId?: number;
  private categories: Array<string> = [];
  private filterString?: string;
  private sortByValue?: SortBy;
  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  public products: Array<IProductInfo> = [];
  public page: number = 1;
  public SortBy = SortBy;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const mode: "banner-sale" | "category" | "search"  = params['mode'];
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
        this.categories = [this.categories[this.categories.length - 1]]
      }
      
      if (mode === "banner-sale") {
        this.fetchproductsBasedOnCriteria();
      } else if (mode === "search") {
        this.productsService
        .getProductsBySearch(searchText)
        .subscribe((products) => {
          this.products = products;
        });
      }  else {
        this.fetchproductsBasedOnCriteria();
      }
      
      
    });
  }

  goToDetailPage(product: IProductInfo) {
    this.productsService.productSelected = product;
    this.router.navigate(['product', `${product.id}`]);
  }

  onFilterChange(filterString: string): void {
    this.filterString = filterString;
    this.fetchproductsBasedOnCriteria();
  }

  onSortByChange(sortEvent: Event) {
    if (sortEvent.target) {
      const sortBy: SortBy = (sortEvent.target as any).value;
      this.sortByValue = sortBy;
      this.fetchproductsBasedOnCriteria();
    }
    
  }

  private fetchproductsBasedOnCriteria(): void {
    this.productsService
        .filterProductsByCriteria({
          category: this.categories,
          filterString: this.filterString,
          saleId: this.saleId
        }, this.sortByValue)
        .subscribe((products) => {
          this.products = products;
        });
  }
}

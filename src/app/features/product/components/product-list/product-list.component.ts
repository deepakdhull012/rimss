import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'rimss-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public products: Array<IProductInfo> = [];
  public page: number = 1;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const mode: "banner-sale" | "category" | "search"  = params['mode'];
      const saleId = params['saleId'];
      const searchText = params['search'];
      const categoryParam = params['category'];
      let categories: Array<string> = [];
      if (typeof categoryParam === 'string') {
        categories.push(categoryParam);
        console.error(categories, typeof categories);
      } else {
        categories = categoryParam;
      }
      if (mode === "banner-sale") {
        this.productsService
        .getSaleProducts(saleId)
        .subscribe((products) => {
          this.products = products;
        });
      } else if (mode === "search") {
        this.productsService
        .getProductsBySearch(searchText)
        .subscribe((products) => {
          this.products = products;
        });
      }  else {
        this.productsService
        .fetchCategoryProducts(categories)
        .subscribe((products) => {
          this.products = products;
        });
      }
      
      
    });
  }

  goToDetailPage(product: IProductInfo) {
    this.productsService.productSelected = product;
    this.router.navigate(['product', `${product.id}`]);
  }

  onFilterChange(filterString: string): void {
    this.productsService
    .filterProductsByCriteria({
      category: [],
      filterString
    })
    .subscribe((products) => {
      this.products = products;
    });
  }
}

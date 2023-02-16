import { Component, OnInit } from '@angular/core';
import { IProductInfoConfig } from 'src/app/features/product/interfaces/product-info.interface';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'rimss-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  constructor(private productsService: ProductsService) { }

  public products: Array<IProductInfo> = [];
  public productInfoConfig: IProductInfoConfig = {
    displayFavouriteIcon: false
  };
  ngOnInit(): void {
    this.productsService
        .fetchAllProducts()
        .subscribe((products) => {
          this.products = products;
        });
  }

}

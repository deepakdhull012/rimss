import { Component, OnInit } from '@angular/core';
import { IProductInfoConfig } from 'src/app/features/product/interfaces/product-info.interface';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { IWishList } from 'src/app/shared/interfaces/client/wish-list.interface';
import { ProductsService } from 'src/app/api/products.service';
import { CartWishlistService } from '../../services/cart-wishlist.service';

@Component({
  selector: 'rimss-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  constructor(private cartWishListService: CartWishlistService) { }

  public wishListProducts: Array<IProductInfo> = [];
  public productInfoConfig: IProductInfoConfig = {
    displayFavouriteIcon: false
  };
  ngOnInit(): void {
    this.cartWishListService
        .getWishListProducts()
        .subscribe((products) => {
          this.wishListProducts = products;
        });
  }

}

import { Component, OnInit } from '@angular/core';
import { IProductInfoConfig } from 'src/app/features/product/interfaces/product-info.interface';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { CartWishlistService } from '../../services/cart-wishlist.service';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'rimss-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent extends BaseComponent implements OnInit {
  constructor(private cartWishListService: CartWishlistService) {
    super();
  }

  public wishListProducts: Array<IProductInfo> = [];
  public productInfoConfig: IProductInfoConfig = {
    displayFavouriteIcon: false,
  };

  public ngOnInit(): void {
    this.getWishListProducts();
  }

  private getWishListProducts(): void {
    this.cartWishListService
      .getWishListProducts()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (products) => {
          this.wishListProducts = products;
        },
      });
  }
}

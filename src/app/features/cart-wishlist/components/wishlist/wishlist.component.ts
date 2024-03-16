import { Component, OnInit } from '@angular/core';
import { IProductInfoConfig } from 'src/app/features/product/interfaces/product-info.interface';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { takeUntil } from 'rxjs';
import { selectWishlistProducts } from '../../store/cart-wishlist.selectors';
import { IAppState } from 'src/app/core/store/app.state';
import { Store } from '@ngrx/store';
import * as CartWishlistActions from "./../../store/cart-wishlist.actions";

@Component({
  selector: 'rimss-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent extends BaseComponent implements OnInit {
  constructor(private store: Store<IAppState>) {
    super();
  }

  public wishListProducts: Array<IProductInfo> = [];
  public productInfoConfig: IProductInfoConfig = {
    displayFavouriteIcon: false,
  };

  public ngOnInit(): void {
    this.getWishListProducts();
  }

  /**
   * Fetch wishlist products from ngrx store
   */
  private getWishListProducts(): void {
    this.store.dispatch(CartWishlistActions.fetchWishlistProducts());
    this.store.select(selectWishlistProducts)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (products) => {
          this.wishListProducts = products;
        },
      });
  }
}

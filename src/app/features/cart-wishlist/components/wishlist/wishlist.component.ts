import { Component, OnInit } from '@angular/core';
import { IProductInfoConfig } from 'src/app/features/product/interfaces/product-info.interface';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { filter, takeUntil } from 'rxjs';
import { selectWishlistProducts } from '../../store/cart-wishlist.selectors';
import { IAppState } from 'src/app/core/store/app.state';
import { ActionsSubject, Store } from '@ngrx/store';
import * as CartWishlistActions from './../../store/cart-wishlist.actions';

@Component({
  selector: 'rimss-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent extends BaseComponent implements OnInit {
  constructor(
    private store: Store<IAppState>,
    private actionsSubject$: ActionsSubject
  ) {
    super();
  }

  public wishListProducts: Array<IProductInfo> = [];
  public productInfoConfig: IProductInfoConfig = {
    displayFavouriteIcon: false,
  };

  public ngOnInit(): void {
    this.listenToActionsResponse();
    this.getWishListProducts();
  }

  /**
   * Listen to actions response, such as wishlist success
   */
  private listenToActionsResponse(): void {
    this.actionsSubject$
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter(
          (action) =>
            action.type === CartWishlistActions.loadWishListProducts.type
        )
      )
      .subscribe(() => {
        this.loadWishlistItemsfromStore();
      });
  }

  /**
   * Fetch wishlist products from ngrx store
   */
  private getWishListProducts(): void {
    this.store.dispatch(CartWishlistActions.fetchWishlistProducts());
  }

  /**
   * Load wishlist items from store
   */
  private loadWishlistItemsfromStore(): void {
    this.store
      .select(selectWishlistProducts)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (products) => {
          this.wishListProducts = products;
        },
      });
  }
}

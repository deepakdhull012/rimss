import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { BaseComponent } from './core/components/base/base.component';
import { AuthService } from './features/authentication/services/auth.service';
import { CartWishlistService } from './features/cart-wishlist/services/cart-wishlist.service';
import { BannerService } from './shared/services/banner.service';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends BaseComponent implements OnInit {
  constructor(
    private cartWishListService: CartWishlistService,
    private authservice: AuthService,
    private logger: NGXLogger
  ) {
    super();
  }

  public ngOnInit(): void {
    this.logger.info("application bootstraped");
    if (this.authservice.getLoggedInEmail()) {
      this.cartWishListService
        .getCartProducts()
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe((products) => {
          this.cartWishListService.cartProducts = products;
        });

        this.cartWishListService
        .getWishListProducts()
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe();
    }
  }

  title = 'Retail Inventory Software';
}

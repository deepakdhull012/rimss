import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductModule } from '../product/product.module';
import { CartWishListRoutingModule } from './cart-wishlist.routes';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [CartComponent, WishlistComponent],
  imports: [
    CommonModule,
    SharedModule,
    CartWishListRoutingModule,
    ProductModule,
    MatButtonModule
  ],
  providers: [],
})
export class CartWishlistModule {}

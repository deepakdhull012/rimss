import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "cart",
        component: CartComponent
      },
      {
        path: "wish-list",
        component: WishlistComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartWishListRoutingModule { }
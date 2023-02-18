import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import('./features/landing/landing.module').then(module => module.LandingModule),
  },
  {
    path: "products",
    loadChildren: () => import('./features/product/product.module').then(module => module.ProductModule),
  },
  {
    path: "user",
    loadChildren: () => import('./features/cart-wishlist/cart-wishlist.module').then(module => module.CartWishlistModule),
    canActivate: [AuthGuard]
  },
  {
    path: "profile",
    loadChildren: () => import('./features/user/user.module').then(module => module.UserModule),
    canActivate: [AuthGuard]
  },
  {
    path: "orders",
    loadChildren: () => import('./features/orders/orders.module').then(module => module.OrdersModule),
    canActivate: [AuthGuard]
  },
  {
    path: "checkout",
    loadChildren: () => import('./features/checkout/checkout.module').then(module => module.CheckoutModule),
    canActivate: [AuthGuard]
  },
  {
    path: "thank-you",
    loadChildren: () => import('./features/thank-you/thank-you.module').then(module => module.ThankYouModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/authentication/authentication.module').then(module => module.AuthenticationModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { cartWishlistFeatureKey, cartWishlistReducer } from './features/cart-wishlist/store/cart-wishlist.reducers';
import { CartWishlistEffects } from './features/cart-wishlist/store/cart-wishlist.effects';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    NoopAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot({}),
    // Cart wish list module may not be available yet but we may need to access cart, wishlist products
    StoreModule.forFeature(cartWishlistFeatureKey, cartWishlistReducer),
    EffectsModule.forFeature(CartWishlistEffects)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

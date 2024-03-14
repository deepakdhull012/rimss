import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  cartWishlistFeatureKey,
  cartWishlistReducer,
} from './features/cart-wishlist/store/cart-wishlist.reducers';
import { CartWishlistEffects } from './features/cart-wishlist/store/cart-wishlist.effects';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CategoryService } from './api/category.service';
import { userFeatureKey, userReducer } from './features/user/store/users.reducers';
import { UserEffect } from './features/user/store/users.effects';
import { authFeatureKey, authReducer } from './features/authentication/store/auth.reducers';
import { AuthEffect } from './features/authentication/store/auth.effects';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    NoopAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot({}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    // Cart wish list module may not be available yet but we may need to access cart, wishlist products
    StoreModule.forFeature(cartWishlistFeatureKey, cartWishlistReducer),
    EffectsModule.forFeature(CartWishlistEffects),

    StoreModule.forFeature(authFeatureKey, authReducer),
    EffectsModule.forFeature(AuthEffect),
  ],
  providers: [CategoryService],
  bootstrap: [AppComponent],
})
export class AppModule {}

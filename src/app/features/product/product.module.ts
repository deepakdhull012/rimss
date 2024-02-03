import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { StarRatingModule } from 'angular-star-rating';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterModule } from '../filter/filter.module';

import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductInfoComponent } from './components/product-info/product-info.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductRoutingModule } from './product.routes';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { productReducer } from "./store/products.reducers";
import { EffectsModule } from '@ngrx/effects';
import { ProductsEffects } from "./store/products.effects";



@NgModule({
  declarations: [
    ProductDetailComponent,
    ProductInfoComponent,
    ProductListComponent
  ],
  imports: [
    CommonModule,
    FilterModule,
    ProductRoutingModule,
    NgxPaginationModule,
    StarRatingModule.forRoot(),
    MatSelectModule,
    SharedModule,
    StoreModule.forFeature("products", productReducer),
    EffectsModule.forFeature(ProductsEffects)
  ],
  exports: [
    ProductInfoComponent
  ],
  providers: [
    
  ]
})
export class ProductModule { }

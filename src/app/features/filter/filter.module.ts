import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceFilterComponent } from './components/price-filter/price-filter.component';
import { BrandFilterComponent } from './components/brand-filter/brand-filter.component';
import { RatingFilterComponent } from './components/rating-filter/rating-filter.component';
import { DiscountFilterComponent } from './components/discount-filter/discount-filter.component';
import { SizeFilterComponent } from './components/size-filter/size-filter.component';
import { FilterComponent } from './filter.component';
import { MatCheckboxModule, MatDividerModule, MatExpansionModule } from '@angular/material';
import { StarRatingModule } from 'angular-star-rating'




@NgModule({
  declarations: [
    PriceFilterComponent,
    BrandFilterComponent,
    RatingFilterComponent,
    DiscountFilterComponent,
    SizeFilterComponent,
    FilterComponent
  ],
  imports: [
    CommonModule,
    StarRatingModule.forChild(),
    MatCheckboxModule,
    MatDividerModule,
    MatExpansionModule,
    
  ],
  exports: [
    PriceFilterComponent,
    BrandFilterComponent,
    RatingFilterComponent,
    DiscountFilterComponent,
    SizeFilterComponent,
    FilterComponent
  ]
})
export class FilterModule { }

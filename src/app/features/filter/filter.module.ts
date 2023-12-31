import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceFilterComponent } from './components/price-filter/price-filter.component';
import { BrandFilterComponent } from './components/brand-filter/brand-filter.component';
import { RatingFilterComponent } from './components/rating-filter/rating-filter.component';
import { DiscountFilterComponent } from './components/discount-filter/discount-filter.component';
import { SizeFilterComponent } from './components/size-filter/size-filter.component';
import { FilterComponent } from './filter.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { StarRatingModule } from 'angular-star-rating';
import { FilterService } from './services/filter.service';

@NgModule({
  declarations: [
    PriceFilterComponent,
    BrandFilterComponent,
    RatingFilterComponent,
    DiscountFilterComponent,
    SizeFilterComponent,
    FilterComponent,
  ],
  imports: [
    CommonModule,
    StarRatingModule.forChild(),
    MatCheckboxModule,
    MatDividerModule,
    MatExpansionModule,
    MatButtonModule,
  ],
  exports: [
    PriceFilterComponent,
    BrandFilterComponent,
    RatingFilterComponent,
    DiscountFilterComponent,
    SizeFilterComponent,
    FilterComponent,
  ],
  providers: [FilterService],
})
export class FilterModule {}

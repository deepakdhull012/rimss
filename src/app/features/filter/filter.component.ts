import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IFilterConfig, IFilterObject, IPriceRange } from './interfaces/filter-config.interface';
import { FilterService } from './services/filter.service';

@Component({
  selector: 'rimss-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Input() filterConfig: IFilterConfig = {
    brandFilter: true,
    discountFilter: true,
    priceFilter: true,
    ratingFilter: true,
    sizeFilter: true
  }

  @Output() filterChange: EventEmitter<string> = new EventEmitter<string>();

  private filterObject: IFilterObject = {
    brandIds: [],
    discount: [],
    priceRange: [],
    rating: [],
    size: []
  };

  private filterString = "";

  constructor(private filterService: FilterService) { }

  ngOnInit(): void {
  }

  onBrandFilterChange(brands: Array<number>): void {
    console.error("Brand change", brands);
    this.filterObject.brandIds = brands;
    this.updateFilterString();

    // OR
  }

  onPriceFilterChange(price: Array<IPriceRange>): void {
    console.error("Price change", price);
    this.filterObject.priceRange = price;
    this.updateFilterString();
    // Or with le ge
  }

  onRatingFilterChange(ratings: Array<number>): void {
    console.error("Rating change", ratings);
    this.filterObject.rating = ratings;
    this.updateFilterString();
    // OR
  }

  onSizeFilterChange(sizes: Array<string>): void {
    console.error("Size change", sizes);
    this.filterObject.size = sizes;
    this.updateFilterString();
    // OR
  }

  onDiscountFilterChange(discounts: Array<number>): void {
    this.filterObject.discount = discounts;
    this.updateFilterString();
    console.error("Discount change", discounts);
    // or with le ge
  }

  updateFilterString(): void {
    this.filterString = this.filterService.getFilterString(this.filterObject);
    this.filterChange.next(this.filterString);
  }

  clearAll(): void {
    this.filterService.onClear.next();
  }

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  IFilterConfig,
  IFilterObject
} from './interfaces/filter-config.interface';
import { FilterUtilService } from 'src/app/utils/filter-util.service';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import * as FiltersActions from './store/filter.actions';
import { getFilterState } from './store/filter.selectors';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';

@Component({
  selector: 'rimss-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent extends BaseComponent implements OnInit {
  @Input() filterConfig: IFilterConfig = {
    brandFilter: true,
    discountFilter: true,
    priceFilter: true,
    ratingFilter: true,
    sizeFilter: true,
  };

  @Output() filterChange: EventEmitter<string> = new EventEmitter<string>();

  private filterObject: IFilterObject = {
    selectedBrands: [],
    selectedDiscountRanges: [],
    selectedPriceRanges: [],
    selectedRating: [],
    selectedSizes: [],
  };

  private filterString = '';

  constructor(
    private store: Store<IAppState>,
    private filterUtilService: FilterUtilService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.store.select(getFilterState).pipe(takeUntil(this.componentDestroyed$)).subscribe(filterState => {
      this.filterObject = filterState;
      this.updateFilterString();
    })
  }

  public clearAll(): void {
    this.store.dispatch(FiltersActions.clearAllFilters());
  }

  private updateFilterString(): void {
    this.filterString = this.filterUtilService.getFilterString(
      this.filterObject
    );
    this.filterChange.next(this.filterString);
  }
}

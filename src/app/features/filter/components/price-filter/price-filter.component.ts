import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IPriceRange } from '../../interfaces/filter-config.interface';
import { ActionsSubject, Store } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import * as FiltersActions from './../../store/filter.actions';
import { selectPriceBreakPoints } from '../../store/filter.selectors';

@Component({
  selector: 'rimss-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.scss'],
})
export class PriceFilterComponent extends BaseComponent implements OnInit {
  private priceBreakPoints: Array<number> = [];
  public priceRange: Array<IPriceRange> = [];

  public selectedPriceRange: Array<IPriceRange> = [];

  constructor(
    private store: Store<IAppState>,
    private actionsSubject$: ActionsSubject
  ) {
    super();
  }

  public ngOnInit(): void {
    this.listenToActionsResponse();
    this.fetchPriceBreakPoints();
  }

  /**
   * Dispatch action to fetch products based on selected price range
   * @param event MatCheckboxChange
   */
  public onPriceChange(event: MatCheckboxChange): void {
    const index = +event.source.value;
    if (event.checked) {
      this.selectedPriceRange = [
        ...this.selectedPriceRange,
        this.priceRange[index],
      ];
    } else {
      const matchingIndex = this.selectedPriceRange.findIndex((priceRange) => {
        return priceRange.index === index;
      });

      this.selectedPriceRange = this.selectedPriceRange.filter(
        (pr, index) => index !== matchingIndex
      );
    }
    this.store.dispatch(
      FiltersActions.priceRangeChanged({
        priceRange: this.selectedPriceRange,
      })
    );
  }

  /**
   * Listen to actions response, such as load discount success
   */
  private listenToActionsResponse(): void {
    this.actionsSubject$
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter(
          (action) =>
            action.type === FiltersActions.loadDiscountBreakpoints.type
        )
      )
      .subscribe(() => {
        this.loadPriceBreakPointsFromStore();
      });
  }

  /**
   * Fetch price breakpoints from ngrx store
   */
  private fetchPriceBreakPoints(): void {
    this.store.dispatch(FiltersActions.fetchPriceBreakPoints());
  }

  /**
   * Load price breakpoints points from store
   */
  private loadPriceBreakPointsFromStore(): void {
    this.store
      .select(selectPriceBreakPoints)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (priceRange) => {
          this.priceBreakPoints = priceRange;
          this.updateRange();
        },
      });
  }

  /**
   * Update price range based on price breakpoints
   */
  private updateRange(): void {
    this.priceRange = this.priceBreakPoints.map((priceBreakPoint, index) => {
      if (index === 0) {
        return {
          index: index,
          min: 0,
          max: this.priceBreakPoints[index],
          displayText: `Below ${this.priceBreakPoints[index]}`,
        };
      } else {
        return {
          index,
          displayText: `${this.priceBreakPoints[index - 1]} - ${
            this.priceBreakPoints[index]
          }`,
          max: this.priceBreakPoints[index],
          min: this.priceBreakPoints[index - 1],
        };
      }
    });
    this.priceRange.push({
      index: this.priceBreakPoints.length,
      min: this.priceBreakPoints[this.priceBreakPoints.length - 1],
      max: 10000000,
      displayText: `Above ${
        this.priceBreakPoints[this.priceBreakPoints.length - 1]
      }`,
    });
  }
}

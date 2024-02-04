import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IPriceRange } from '../../interfaces/filter-config.interface';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import * as FiltersAction from './../../store/filter.actions';
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

  constructor(private store: Store<IAppState>) {
    super();
  }

  public ngOnInit(): void {
    this.fetchPriceBreakPoints();
  }

  public onPriceChange(event: MatCheckboxChange): void {
    const index = +event.source.value;
    if (event.checked) {
      console.error(
        'selected price range',
        this.selectedPriceRange,
        this.priceRange[index],
        index
      );
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
      FiltersAction.priceRangeChanged({
        priceRange: this.selectedPriceRange,
      })
    );
  }

  private fetchPriceBreakPoints(): void {
    this.store.dispatch(FiltersAction.fetchPriceBreakPoints());
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

  private updateRange() {
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

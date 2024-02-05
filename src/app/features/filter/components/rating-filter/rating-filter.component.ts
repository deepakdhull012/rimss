import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { min, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IFilterRating } from '../../interfaces/filter-config.interface';
import { IAppState } from 'src/app/core/store/app.state';
import * as FiltersActions from './../../store/filter.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'rimss-rating-filter',
  templateUrl: './rating-filter.component.html',
  styleUrls: ['./rating-filter.component.scss'],
})
export class RatingFilterComponent extends BaseComponent implements OnInit {
  public ratingOptions: Array<IFilterRating> = [];
  public selectedRatingOptions: Array<number> = [];
  @Output() ratingChange: EventEmitter<Array<number>> = new EventEmitter<
    Array<number>
  >();

  constructor(private store: Store<IAppState>) {
    super();
  }

  public ngOnInit(): void {
    this.initRatingOptions();
  }

  onRatingChange(event: MatCheckboxChange): void {
    const minRating = +event.source.value;
    if (event.checked) {
      this.selectedRatingOptions = [...this.selectedRatingOptions, minRating];
    } else {
      const matchingIndex = this.selectedRatingOptions.indexOf(minRating);
      this.selectedRatingOptions = this.selectedRatingOptions.filter(
        (r, i) => i !== matchingIndex
      );
    }
    this.store.dispatch(
      FiltersActions.ratingChanged({
        ratings: this.selectedRatingOptions,
      })
    );
  }

  private initRatingOptions(): void {
    this.ratingOptions.length = 0;
    this.ratingOptions = [
      {
        minRating: 0,
        displayValue: 0.5,
      },
      {
        minRating: 1,
        displayValue: 1.5,
      },
      {
        minRating: 2,
        displayValue: 2.5,
      },
      {
        minRating: 3,
        displayValue: 3.5,
      },
      {
        minRating: 4,
        displayValue: 4.5,
      },
    ];
  }
}

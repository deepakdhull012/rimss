import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IFilterRating } from '../../interfaces/filter-config.interface';
import { FilterService } from '../../services/filter.service';

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

  constructor(private filterService: FilterService) {
    super();
  }

  public ngOnInit(): void {
    this.handleClear();
    this.initRatingOptions();
  }

  onRatingChange(event: MatCheckboxChange): void {
    const minRating = +event.source.value;
    if (event.checked) {
      this.selectedRatingOptions.push(minRating);
    } else {
      const matchingIndex = this.selectedRatingOptions.indexOf(minRating);
      this.selectedRatingOptions.splice(matchingIndex, 1);
    }
    this.ratingChange.next(this.selectedRatingOptions);
  }

  private handleClear(): void {
    this.filterService.onClear
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (_) => {
          this.selectedRatingOptions = [];
          this.ratingChange.next(this.selectedRatingOptions);
        },
      });
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

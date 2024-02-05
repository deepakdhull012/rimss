import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import * as FiltersActions from './../../store/filter.actions';
import {
  selectDiscountBreakPoints,
} from '../../store/filter.selectors';
import { IAppState } from 'src/app/core/store/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'rimss-discount-filter',
  templateUrl: './discount-filter.component.html',
  styleUrls: ['./discount-filter.component.scss'],
})
export class DiscountFilterComponent extends BaseComponent implements OnInit {
  public discounts: Array<number> = [];
  public selectedDiscounts: Array<number> = [];
  @Output() discountChange: EventEmitter<Array<number>> = new EventEmitter<
    Array<number>
  >();

  constructor(private store: Store<IAppState>) {
    super();
  }

  public ngOnInit(): void {
    this.fetchDiscountBreakPoints();
  }

  public onDiscountChange(event: MatCheckboxChange): void {
    if (event.checked) {
      this.selectedDiscounts.push(+event.source.value);
    } else {
      const index = this.selectedDiscounts.indexOf(+event.source.value);
      this.selectedDiscounts.splice(index, 1);
    }
    this.discountChange.next(this.selectedDiscounts);
  }

  private fetchDiscountBreakPoints(): void {
    this.store.dispatch(FiltersActions.fetchDiscountBreakpoints());
    this.store
      .select(selectDiscountBreakPoints)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (discountBreakPoints) => {
          this.discounts = discountBreakPoints;
        },
      });
  }
}

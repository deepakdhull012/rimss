import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { FilterService } from '../../services/filter.service';

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

  constructor(private filterService: FilterService) {
    super();
  }

  public ngOnInit(): void {
    this.handleClear();
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

  private handleClear(): void {
    this.filterService.onClear
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((_) => {
        this.selectedDiscounts = [];
        this.discountChange.next(this.selectedDiscounts);
      });
  }

  private fetchDiscountBreakPoints(): void {
    this.filterService
      .getDiscountBreakPoints()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (discounts) => {
          this.discounts = discounts;
        },
      });
  }
}

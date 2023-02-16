import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
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
  @Output() discountChange: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();

  constructor(private filterService: FilterService) {
    super();
  }

  ngOnInit(): void {
    this.filterService.onClear.pipe(takeUntil(this.componentDestroyed$)).subscribe(_ => {
      this.selectedDiscounts = [];
      this.discountChange.next(this.selectedDiscounts);
    });
    this.filterService
      .getDiscountBreakPoints()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((discounts) => {
        this.discounts = discounts;
      });
  }

  onDiscountChange(event: MatCheckboxChange): void {
    if (event.checked) {
      this.selectedDiscounts.push(+event.source.value);
    } else {
      const index = this.selectedDiscounts.indexOf(+event.source.value);
      this.selectedDiscounts.splice(index, 1);
    }
    this.discountChange.next(this.selectedDiscounts);
  }
}

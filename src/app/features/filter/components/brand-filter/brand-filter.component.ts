import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IBrand } from '../../interfaces/filter-config.interface';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'rimss-brand-filter',
  templateUrl: './brand-filter.component.html',
  styleUrls: ['./brand-filter.component.scss']
})
export class BrandFilterComponent extends BaseComponent implements OnInit {
  public brands: Array<IBrand> = [];
  public selectedBrands: Array<number> = [];
  @Output() brandsChange: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();

  constructor(private filterService: FilterService) {
    super();
   }

  ngOnInit(): void {
    this.filterService.onClear.pipe(takeUntil(this.componentDestroyed$)).subscribe(_ => {
      this.selectedBrands = [];
      this.brandsChange.next(this.selectedBrands);
    });
    this.filterService.getBrands().pipe(takeUntil(this.componentDestroyed$)).subscribe(brands => {
      this.brands = brands;
    })
  }

  onBrandsChange(event: MatCheckboxChange): void {
    if (event.checked) {
      this.selectedBrands.push(+event.source.value);
    } else {
      const index = this.selectedBrands.indexOf(+event.source.value);
      this.selectedBrands.splice(index, 1);
    }
    this.brandsChange.next(this.selectedBrands);
  }

}

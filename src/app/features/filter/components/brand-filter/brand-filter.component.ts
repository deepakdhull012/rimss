import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IBrand } from '../../interfaces/filter-config.interface';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import * as FiltersActions from './../../store/filter.actions';
import { selectBrands } from '../../store/filter.selectors';

@Component({
  selector: 'rimss-brand-filter',
  templateUrl: './brand-filter.component.html',
  styleUrls: ['./brand-filter.component.scss'],
})
export class BrandFilterComponent extends BaseComponent implements OnInit {
  public brands: Array<IBrand> = [];
  public selectedBrands: Array<number> = [];

  constructor(private store: Store<IAppState>) {
    super();
  }

  public ngOnInit(): void {
    this.fetchBrands();
  }

  public onBrandsChange(event: MatCheckboxChange): void {
    if (event.checked) {
      this.selectedBrands = [...this.selectedBrands, +event.source.value]
    } else {
      const index = this.selectedBrands.indexOf(+event.source.value);
      this.selectedBrands = this.selectedBrands.filter((bramd, i) => i !== index)
    }
    this.store.dispatch(FiltersActions.brandChanged({
      selectedBrands: this.selectedBrands
    }));
  }

  private fetchBrands(): void {
    this.store.dispatch(FiltersActions.fetchBrands());
    this.store
      .select(selectBrands)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (brands) => {
          this.brands = brands;
        },
      });
  }
}

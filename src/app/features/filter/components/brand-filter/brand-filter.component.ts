import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IBrand } from '../../interfaces/filter-config.interface';
import { ActionsSubject, Store } from '@ngrx/store';
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

  constructor(
    private store: Store<IAppState>,
    private actionsSubject$: ActionsSubject
  ) {
    super();
  }

  public ngOnInit(): void {
    this.listenToActionsResponse();
    this.fetchBrands();
  }

  /**
   * Dispatch action to fetch products based on selected brands
   * @param event MatCheckboxChange
   */
  public onBrandsChange(event: MatCheckboxChange): void {
    if (event.checked) {
      this.selectedBrands = [...this.selectedBrands, +event.source.value];
    } else {
      const index = this.selectedBrands.indexOf(+event.source.value);
      this.selectedBrands = this.selectedBrands.filter(
        (brand, i) => i !== index
      );
    }
    this.store.dispatch(
      FiltersActions.brandChanged({
        selectedBrands: this.selectedBrands,
      })
    );
  }

  /**
   * Fetch brands from ngrx store
   */
  private fetchBrands(): void {
    this.store.dispatch(FiltersActions.fetchBrands());
  }

  /**
   * Listen to actions response, such as wishlist success
   */
  private listenToActionsResponse(): void {
    this.actionsSubject$
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter(
          (action) =>
            action.type === FiltersActions.loadBrands.type
        )
      )
      .subscribe(() => {
        this.loadBrandsFromStore();
      });
  }

  /**
   * Load brands from store
   */
  private loadBrandsFromStore(): void {
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

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { ActionsSubject, Store } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import * as FiltersActions from './../../store/filter.actions';
import { selectSizes } from '../../store/filter.selectors';

@Component({
  selector: 'rimss-size-filter',
  templateUrl: './size-filter.component.html',
  styleUrls: ['./size-filter.component.scss'],
})
export class SizeFilterComponent extends BaseComponent implements OnInit {
  public sizes: Array<string> = [];
  public selectedSizes: Array<string> = [];
  @Output() sizeChange: EventEmitter<Array<string>> = new EventEmitter<
    Array<string>
  >();

  constructor(
    private store: Store<IAppState>,
    private actionsSubject$: ActionsSubject
  ) {
    super();
  }

  public ngOnInit(): void {
    this.listenToActionsResponse();
    this.fetchSizes();
  }

  /**
   * Dispatch action to fetch products based on selected sizes
   * @param event MatCheckboxChange
   */
  public onSizeChange(event: MatCheckboxChange): void {
    const size = event.source.value;
    if (event.checked) {
      this.selectedSizes = [...this.selectedSizes, size];
    } else {
      const matchingIndex = this.selectedSizes.indexOf(size);
      this.selectedSizes = this.selectedSizes.filter(
        (s, i) => i !== matchingIndex
      );
    }
    this.store.dispatch(
      FiltersActions.sizeChanged({
        sizes: this.selectedSizes,
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
        filter((action) => action.type === FiltersActions.loadSizes.type)
      )
      .subscribe(() => {
        this.loadsizesFromStore();
      });
  }

  /**
   * Fetch sizes from ngrx store
   */
  private fetchSizes(): void {
    this.store.dispatch(FiltersActions.fetchSizes());
  }

  private loadsizesFromStore(): void {
    this.store
      .select(selectSizes)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (sizes) => {
          this.sizes = sizes;
        },
      });
  }
}

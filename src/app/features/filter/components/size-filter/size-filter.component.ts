import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { Store } from '@ngrx/store';
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

  constructor(private store: Store<IAppState>) {
    super();
  }

  public ngOnInit(): void {
    this.fetchSizes();
  }

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

  private fetchSizes(): void {
    this.store.dispatch(FiltersActions.fetchSizes());
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

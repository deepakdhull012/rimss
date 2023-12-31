import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { FilterService } from '../../services/filter.service';

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

  constructor(private filterService: FilterService) {
    super();
  }

  public ngOnInit(): void {
    this.handleClear();
    this.fetchSizes();
  }

  public onSizeChange(event: MatCheckboxChange): void {
    const size = event.source.value;
    if (event.checked) {
      this.selectedSizes.push(size);
    } else {
      const matchingIndex = this.selectedSizes.indexOf(size);
      this.selectedSizes.splice(matchingIndex, 1);
    }
    this.sizeChange.next(this.selectedSizes);
  }

  private handleClear(): void {
    this.filterService.onClear
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((_) => {
        this.selectedSizes = [];
        this.sizeChange.next(this.selectedSizes);
      });
  }

  private fetchSizes(): void {
    this.filterService
      .getSizes()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (sizes) => {
          this.sizes = sizes;
        },
      });
  }
}

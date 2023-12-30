import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'rimss-size-filter',
  templateUrl: './size-filter.component.html',
  styleUrls: ['./size-filter.component.scss']
})
export class SizeFilterComponent extends BaseComponent implements OnInit {
  public sizes: Array<string> = [];
  public selectedSizes: Array<string> = [];
  @Output() sizeChange: EventEmitter<Array<string>> =
    new EventEmitter<Array<string>>();

  constructor(private filterService: FilterService) { 
    super();
  }

  ngOnInit(): void {
    this.filterService.onClear.pipe(takeUntil(this.componentDestroyed$)).subscribe(_ => {
      this.selectedSizes = [];
      this.sizeChange.next(this.selectedSizes);
    });
    this.filterService.getSizes().pipe(takeUntil(this.componentDestroyed$)).subscribe(sizes => {
      this.sizes = sizes;
    })
  }

  onSizeChange(event: MatCheckboxChange): void {
    const size = event.source.value;
    if (event.checked) {
      this.selectedSizes.push(size);
    } else {
      const matchingIndex = this.selectedSizes.indexOf(size);
      this.selectedSizes.splice(matchingIndex, 1);
    }
    this.sizeChange.next(this.selectedSizes);
  }

}

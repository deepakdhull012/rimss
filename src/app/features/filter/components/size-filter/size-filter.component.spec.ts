import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SizeFilterComponent } from './size-filter.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as FiltersActions from './../../store/filter.actions';
import { IFilterState } from '../../store/filter.state';

describe('SizeFilterComponent', () => {
  let component: SizeFilterComponent;
  let fixture: ComponentFixture<SizeFilterComponent>;
  let store: MockStore;
  const initialState: IFilterState = {
    brands: [],
    discountBreakPoints: [],
    priceBreakPoints: [],
    sizes: [],
    filterState: {
      selectedBrands: [],
      selectedDiscountRanges: [],
      selectedPriceRanges: [],
      selectedRating: [],
      selectedSizes: [],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        StoreModule.forRoot(),
        EffectsModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      providers: [TranslateService, provideMockStore({ initialState })],
      declarations: [SizeFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SizeFilterComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update selected sizes and dispatch action', () => {
    component.selectedSizes = [];
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    const mockEvent: MatCheckboxChange = {
      source: { value: 'Small' } as MatCheckbox,
      checked: true,
    };
    // Act
    component.onSizeChange(mockEvent);
    // Assert
    expect(component.selectedSizes).toEqual(['Small']);
    expect(dispatchSpy).toHaveBeenCalledWith(
      FiltersActions.sizeChanged({
        sizes: ['Small'],
      })
    );
  });

  it('should remove item from selected sizes  and dispatch action', () => {
    component.selectedSizes = ['Large', 'Small'];
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    const mockEvent: MatCheckboxChange = {
      source: { value: 'Large' } as MatCheckbox,
      checked: false,
    };
    // Act
    component.onSizeChange(mockEvent);
    // Assert
    expect(component.selectedSizes).toEqual(['Small']);
    expect(dispatchSpy).toHaveBeenCalledWith(
      FiltersActions.sizeChanged({
        sizes: ['Small'],
      })
    );
  });
});

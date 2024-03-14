import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DiscountFilterComponent } from './discount-filter.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import * as FiltersActions from './../../store/filter.actions';

describe('DiscountFilterComponent', () => {
  let component: DiscountFilterComponent;
  let fixture: ComponentFixture<DiscountFilterComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      providers: [TranslateService, provideMockStore()],
      declarations: [DiscountFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DiscountFilterComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update selected discounts and dispatch action', () => {
    component.selectedDiscounts = [];
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    const mockEvent: MatCheckboxChange = {
      source: { value: '1' } as MatCheckbox,
      checked: true,
    };
    // Act
    component.onDiscountChange(mockEvent);
    // Assert
    expect(component.selectedDiscounts).toEqual([1]);
    expect(dispatchSpy).toHaveBeenCalledWith(
      FiltersActions.discountRangeChanged({
        discountRange: [1],
      })
    );
  });

  it('should update removed discounts and dispatch action', () => {
    component.selectedDiscounts = [1,2];
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    const mockEvent: MatCheckboxChange = {
      source: { value: '2' } as MatCheckbox,
      checked: false,
    };
    // Act
    component.onDiscountChange(mockEvent);
    // Assert
    expect(component.selectedDiscounts).toEqual([1]);
    expect(dispatchSpy).toHaveBeenCalledWith(
      FiltersActions.discountRangeChanged({
        discountRange: [1],
      })
    );
  });
});

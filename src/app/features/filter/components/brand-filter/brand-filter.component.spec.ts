import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BrandFilterComponent } from './brand-filter.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import * as FiltersActions from './../../store/filter.actions';

describe('BrandFilterComponent', () => {
  let component: BrandFilterComponent;
  let fixture: ComponentFixture<BrandFilterComponent>;
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
      declarations: [BrandFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandFilterComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update selected discounts and dispatch action', () => {
    component.selectedBrands = [];
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    const mockEvent: MatCheckboxChange = {
      source: { value: '1' } as MatCheckbox,
      checked: true,
    };
    // Act
    component.onBrandsChange(mockEvent);
    // Assert
    expect(component.selectedBrands).toEqual([1]);
    expect(dispatchSpy).toHaveBeenCalledWith(
      FiltersActions.brandChanged({
        selectedBrands: [1],
      })
    );
  });

  it('should update removed discounts and dispatch action', () => {
    component.selectedBrands = [1,2];
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    const mockEvent: MatCheckboxChange = {
      source: { value: '2' } as MatCheckbox,
      checked: false,
    };
    // Act
    component.onBrandsChange(mockEvent);
    // Assert
    expect(component.selectedBrands).toEqual([1]);
    expect(dispatchSpy).toHaveBeenCalledWith(
      FiltersActions.brandChanged({
        selectedBrands: [1],
      })
    );
  });
});

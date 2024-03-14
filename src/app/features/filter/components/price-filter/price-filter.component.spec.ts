import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PriceFilterComponent } from './price-filter.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import * as FiltersActions from './../../store/filter.actions';

describe('PriceFilterComponent', () => {
  let component: PriceFilterComponent;
  let fixture: ComponentFixture<PriceFilterComponent>;
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
      declarations: [PriceFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PriceFilterComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update selected price and dispatch action', () => {
    component.priceRange = [
      {
        displayText: "0 - 100",
        index: 0,
        max: 100,
        min: 0
      }
    ];
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    const mockEvent: MatCheckboxChange = {
      source: { value: '0' } as MatCheckbox,
      checked: true,
    };
    // Act
    component.onPriceChange(mockEvent);
    // Assert
    expect(component.selectedPriceRange.length).toEqual(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      FiltersActions.priceRangeChanged({
        priceRange: [component.priceRange[0]],
      })
    );
  });

  it('should update on removing price and dispatch action', () => {
    component.priceRange = [
      {
        displayText: "0 - 100",
        index: 0,
        max: 100,
        min: 0
      },
      {
        displayText: "101 - 200",
        index: 1,
        max: 200,
        min: 101
      }
    ];

    component.selectedPriceRange = [
      {
        displayText: "0 - 100",
        index: 0,
        max: 100,
        min: 0
      },
      {
        displayText: "101 - 200",
        index: 1,
        max: 200,
        min: 101
      }
    ];
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    const mockEvent: MatCheckboxChange = {
      source: { value: '1' } as MatCheckbox,
      checked: false,
    };
    // Act
    component.onPriceChange(mockEvent);
    // Assert
    expect(component.selectedPriceRange.length).toEqual(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      FiltersActions.priceRangeChanged({
        priceRange: [component.priceRange[0]],
      })
    );
  });

  it('should update price range', () => {
    component["priceBreakPoints"] = [
      100,200
    ]
    component["updateRange"]();
    expect(component.selectedPriceRange).toBeDefined();
  })
});

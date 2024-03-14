import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RatingFilterComponent } from './rating-filter.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import * as FiltersActions from './../../store/filter.actions';

describe('RatingFilterComponent', () => {
  let component: RatingFilterComponent;
  let fixture: ComponentFixture<RatingFilterComponent>;
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
      declarations: [RatingFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingFilterComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update selected ratings and dispatch action', () => {
    component.selectedRatingOptions = [];
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    const mockEvent: MatCheckboxChange = {
      source: { value: '1' } as MatCheckbox,
      checked: true,
    };
    // Act
    component.onRatingChange(mockEvent);
    // Assert
    expect(component.selectedRatingOptions).toEqual([1]);
    expect(dispatchSpy).toHaveBeenCalledWith(
      FiltersActions.ratingChanged({
        ratings: [1],
      })
    );
  });

  it('should update selected ratings on remove and dispatch action', () => {
    component.selectedRatingOptions = [2,1];
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    const mockEvent: MatCheckboxChange = {
      source: { value: '2' } as MatCheckbox,
      checked: false,
    };
    // Act
    component.onRatingChange(mockEvent);
    // Assert
    expect(component.selectedRatingOptions).toEqual([1]);
    expect(dispatchSpy).toHaveBeenCalledWith(
      FiltersActions.ratingChanged({
        ratings: [1],
      })
    );
  });
});

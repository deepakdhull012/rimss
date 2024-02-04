import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import * as FiltersActions from './filter.actions';
import { FilterService } from 'src/app/api/filter.service';

@Injectable()
export class FiltersEffect {
  ofilterEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        FiltersActions.fetchBrands,
        FiltersActions.fetchPriceBreakPoints,
        FiltersActions.fetchDiscountBreakpoints,
        FiltersActions.fetchSizes
      ),
      mergeMap((action) => {
        console.error('Filter Effect for ', action.type);
        switch (action.type) {
          case FiltersActions.fetchBrands.type:
            return this.filterService.getBrands().pipe(
              map((brands) => {
                return {
                  type: FiltersActions.loadBrands.type,
                  brands,
                };
              }),
              catchError(() => EMPTY)
            );
          case FiltersActions.fetchPriceBreakPoints.type:
            return this.filterService.getPriceBreakPoint().pipe(
              map((priceBreakPoints) => {
                return {
                  type: FiltersActions.loadPriceBreakpoints.type,
                  priceBreakPoints,
                };
              }),
              catchError(() => EMPTY)
            );

          case FiltersActions.fetchDiscountBreakpoints.type:
            return this.filterService.getDiscountBreakPoints().pipe(
              map((discountBreakPoints) => {
                return {
                  type: FiltersActions.loadDiscountBreakpoints.type,
                  discountBreakPoints,
                };
              }),
              catchError(() => EMPTY)
            );

          case FiltersActions.fetchSizes.type:
            return this.filterService.getSizes().pipe(
              map((sizes) => {
                return {
                  type: FiltersActions.loadSizes.type,
                  sizes,
                };
              }),
              catchError(() => EMPTY)
            );

          default:
            return of(null).pipe(
              map((_) => ({
                type: FiltersActions.loadBrands.type,
                brands: [],
              })),
              catchError(() => EMPTY)
            );
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private filterService: FilterService
  ) {}
}

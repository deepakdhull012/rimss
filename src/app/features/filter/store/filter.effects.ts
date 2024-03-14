import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import * as FiltersActions from './filter.actions';
import { FilterService } from 'src/app/api/filter.service';
import { NGXLogger } from 'ngx-logger';

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
        this.logger.log(`Filter effect: received action ${action.type}`);
        switch (action.type) {
          case FiltersActions.fetchBrands.type:
            return this.filterService.getBrands().pipe(
              map((brands) => {
                this.logger.log(
                  `Filter effect: Success for action: ${action.type} with response ${brands}`
                );
                return {
                  type: FiltersActions.loadBrands.type,
                  brands,
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Filter effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );
          case FiltersActions.fetchPriceBreakPoints.type:
            return this.filterService.getPriceBreakPoint().pipe(
              map((priceBreakPoints) => {
                this.logger.log(
                  `Filter effect: Success for action: ${action.type} with response ${priceBreakPoints}`
                );
                return {
                  type: FiltersActions.loadPriceBreakpoints.type,
                  priceBreakPoints,
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Filter effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );

          case FiltersActions.fetchDiscountBreakpoints.type:
            return this.filterService.getDiscountBreakPoints().pipe(
              map((discountBreakPoints) => {
                this.logger.log(
                  `Filter effect: Success for action: ${action.type} with response ${discountBreakPoints}`
                );
                return {
                  type: FiltersActions.loadDiscountBreakpoints.type,
                  discountBreakPoints,
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Filter effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );

          case FiltersActions.fetchSizes.type:
            return this.filterService.getSizes().pipe(
              map((sizes) => {
                this.logger.log(
                  `Filter effect: Success for action: ${action.type} with response ${sizes}`
                );
                return {
                  type: FiltersActions.loadSizes.type,
                  sizes,
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Filter effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );

          default:
            return of(null).pipe(
              map(() => ({
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
    private filterService: FilterService,
    private logger: NGXLogger
  ) {}
}

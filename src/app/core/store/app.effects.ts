import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { CategoryService } from './../../api/category.service';
import * as RootActions from './app.actions';

@Injectable()
export class CoreEffects {
  rootEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        RootActions.fetchCategories
      ),
      mergeMap((action) => {
        // console.error('Root Effect for ', action.type);
        switch (action.type) {
              case RootActions.fetchCategories.type:
                return this.categoryService
                  .fetchAllCategories()
                  .pipe(
                    map((categories) => {
                        console.log('cats in effect', categories)
                      return {
                        type: RootActions.loadCategories.type,
                        categories: categories,
                      };
                    }),
                    catchError(() => EMPTY)
                  );
          default:
            return of(null).pipe(
              map((_) => ({
                type: RootActions.loadCategories.type,
                categories: [],
              })),
              catchError(() => EMPTY)
            );
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private categoryService: CategoryService
  ) {}
}

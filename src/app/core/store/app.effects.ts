import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { CategoryService } from './../../api/category.service';
import * as RootActions from './app.actions';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class CoreEffects {
  rootEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        RootActions.fetchCategories
      ),
      mergeMap((action) => {
        this.logger.log("App effect: received action: " + action.type);
        switch (action.type) {
              case RootActions.fetchCategories.type:
                return this.categoryService
                  .fetchAllCategories()
                  .pipe(
                    map((categories) => {
                      this.logger.log("App effect: fetch categories success with " + categories);
                      return {
                        type: RootActions.loadCategories.type,
                        categories: categories,
                      };
                    }),
                    catchError(() => {
                      this.logger.error("App effect: fetch categories error.");
                      return EMPTY;
                    })
                  );
          default:
            return of(null).pipe(
              map(() => ({
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
    private categoryService: CategoryService,
    private logger: NGXLogger,
  ) {}
}

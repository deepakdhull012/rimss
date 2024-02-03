import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap } from 'rxjs/operators';
import { ProductsService } from '../../../api/products.service';
import * as ProductActions from './products.actions';

@Injectable()
export class ProductsEffects {
  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ProductActions.requestLoadProducts,
        ProductActions.fetchCategoryProducts
      ),
      mergeMap(action => {
        console.log('effects received')
        switch(action.type) {
          case ProductActions.fetchCategoryProducts.type:
            return this.productsServie
            .filterProductsByCriteria(action.filterCriteria, action.sortBy)
            .pipe(
              map((prod) => {
                console.log("prod", prod)
                return ({
                  type: ProductActions.loadProductsSuccess.type,
                  products: prod,
                })
              } ),
              catchError(() => EMPTY)
            );
          default:
            return this.productsServie
            .filterProductsByCriteria({
              category: [],
              filterString: '',
            })
            .pipe(
              map((products) => ({
                type: ProductActions.loadProductsSuccess.type,
                payload: products,
              })),
              catchError(() => EMPTY)
            );
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private productsServie: ProductsService
  ) {}
}

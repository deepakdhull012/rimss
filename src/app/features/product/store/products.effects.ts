import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { ProductsService } from '../../../api/products.service';
import * as ProductActions from "./products.actions";

@Injectable()
export class ProductsEffects {

  loadMovies$ = createEffect(() => this.actions$.pipe(
    ofType(ProductActions.requestLoadProducts),
    exhaustMap(() => this.productsServie.filterProductsByCriteria({
        category: [],
        filterString: ""
    })
      .pipe(
        map(products => ({ type: ProductActions.loadProductsSuccess.type, payload: products })),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private productsServie: ProductsService
  ) {}
}
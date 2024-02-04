import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap } from 'rxjs/operators';
import { ProductsService } from '../../../api/products.service';
import * as ProductActions from './products.actions';
import { SalesService } from 'src/app/api/sales.service';

@Injectable()
export class ProductsEffects {
  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ProductActions.fetchProductsByCatgory,
        ProductActions.fetchProducts,
        ProductActions.fetchProductsBySearchCritera,
        ProductActions.fetchSimilarProducts,
        ProductActions.fetchProductById,
        ProductActions.fetchRecommendedProducts,
        ProductActions.fetchBannerSales
      ),
      mergeMap((action) => {
        // console.error('Product Effect for ', action.type);
        switch (action.type) {
          case ProductActions.fetchProductsByCatgory.type:
            return this.productsServie
              .filterProductsByCriteria(action.filterCriteria, action.sortBy)
              .pipe(
                map((products) => {
                  return {
                    type: ProductActions.loadProducts.type,
                    products: products,
                  };
                }),
                catchError(() => EMPTY)
              );
          case ProductActions.fetchProducts.type:
            return this.productsServie.fetchAllProducts().pipe(
              map((products) => {
                return {
                  type: ProductActions.loadProducts.type,
                  products: products,
                };
              }),
              catchError(() => EMPTY)
            );
          case ProductActions.fetchProductsBySearchCritera.type:
            return this.productsServie
              .fetchProductsBySearchCriteria(action.searchtext)
              .pipe(
                map((products) => {
                  return {
                    type: ProductActions.loadProducts.type,
                    products: products,
                  };
                }),
                catchError(() => EMPTY)
              );

          case ProductActions.fetchSimilarProducts.type:
            return this.productsServie
              .filterProductsByCriteria(action.filterCriteria)
              .pipe(
                map((products) => {
                  return {
                    type: ProductActions.loadSimilarProducts.type,
                    similarProducts: products,
                  };
                }),
                catchError(() => EMPTY)
              );

          case ProductActions.fetchRecommendedProducts.type:
            return this.productsServie
              .filterProductsByCriteria(action.filterCriteria)
              .pipe(
                map((products) => {
                  return {
                    type: ProductActions.loadRecommendedProducts.type,
                    recommendedProducts: products,
                  };
                }),
                catchError(() => EMPTY)
              );

          case ProductActions.fetchProductById.type:
            return this.productsServie.fetchProductById(action.productId).pipe(
              map((product) => {
                return {
                  type: ProductActions.selectProduct.type,
                  selectedproduct: product,
                };
              }),
              catchError(() => EMPTY)
            );

          case ProductActions.fetchBannerSales.type:
            return this.salesService.fetchAllBannerSales().pipe(
              map((bannerSales) => {
                return {
                  type: ProductActions.loadBannerSales.type,
                  bannerSales,
                };
              }),
              catchError(() => EMPTY)
            );
          default:
            return of(null).pipe(
              map((_) => ({
                type: ProductActions.loadProducts.type,
                payload: [],
              })),
              catchError(() => EMPTY)
            );
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private productsServie: ProductsService,
    private salesService: SalesService
  ) {}
}
